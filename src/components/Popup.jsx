import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Popup = ({ onClose, onSubmit, jobId }) => {
    const [cvOption, setCvOption] = useState(''); // 'existing' or 'new'
    const [coverLetter, setCoverLetter] = useState('');
    const [cvList, setCvList] = useState([]); // State to store list of available CVs
    const [cvId, setCvId] = useState(null); // State to store selected CV ID
    const [coverLetterId, setCoverLetterId] = useState(null); // State to store cover letter ID
    const [uploading, setUploading] = useState(false); // State to handle loading indicator
    const [questions, setQuestions] = useState([]); // State to store questions
    const [answers, setAnswers] = useState({}); // State to store answers
    const [showCoverLetter, setShowCoverLetter] = useState(false); // State to control cover letter visibility
    const [showQuestions, setShowQuestions] = useState(false); // State to control question visibility
    const [error, setError] = useState(''); // State to handle error messages
    const token = localStorage.getItem('Seeker_token');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch available CVs when the component mounts
        const fetchCVList = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/seeker/get-info', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setCvList(response.data.curriculum_vitae || []);
            } catch (error) {
                setError('Error fetching CV list. Please try again.');
                console.error('Error fetching CV list:', error.response ? error.response.data : error.message);
            }
        };

        fetchCVList();
    }, [token]);

    useEffect(() => {
        // Fetch job details to determine if cover letter and questions should be shown
        if (jobId) {
            const fetchJobDetails = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/job/${jobId}`);
                    const jobData = response.data;
                    setShowCoverLetter(jobData.cover_letter === 1);
                    setShowQuestions(jobData.question === 1); // Show questions if `question` is 1
                } catch (error) {
                    setError('Error fetching job details. Please try again.');
                    console.error('Error fetching job details:', error.response ? error.response.data : error.message);
                }
            };

            fetchJobDetails();
        }
    }, [jobId]);

    useEffect(() => {
        // Fetch questions based on the jobId when the component mounts or jobId changes
        if (jobId && showQuestions) {
            const fetchQuestions = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/questions/${jobId}`);
                    setQuestions(response.data.data || []);
                } catch (error) {
                    setError('Error fetching questions. Please try again.');
                    console.error('Error fetching questions:', error.response ? error.response.data : error.message);
                }
            };

            fetchQuestions();
        }
    }, [jobId, showQuestions]);

    const handleCVOptionClick = (option) => {
        setCvOption(option);
        if (option === 'new') {
            navigate('/seeker/cv');
        }
    };

    const handleCoverLetterChange = (event) => setCoverLetter(event.target.value);

    const handleSaveCoverLetter = async () => {
        if (!coverLetter) {
            setError('Please write a cover letter.');
            return;
        }

        setUploading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/coverletter/create', {
                content: coverLetter,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCoverLetterId(response.data.cover_letter_id);
            setError('Cover letter saved successfully.');
        } catch (error) {
            setError('An error occurred while saving the cover letter: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: value
        }));
    };

    const validateAnswers = () => {
        for (const question of questions) {
            const answer = answers[question.id];
            if (question.answer_type === 'integer') {
                const numericAnswer = Number(answer);
                if (isNaN(numericAnswer)) {
                    setError(`Answer for "${question.question}" must be a number.`);
                    return false;
                }
                if (question.min_value !== null && numericAnswer < question.min_value) {
                    setError(`Answer for "${question.question}" must be at least ${question.min_value}.`);
                    return false;
                }
                if (question.max_value !== null && numericAnswer > question.max_value) {
                    setError(`Answer for "${question.question}" must not exceed ${question.max_value}.`);
                    return false;
                }
            }
        }
        return true;
    };

    const handleSubmitAnswers = async () => {
        if (questions.length === 0) {
            setError('No questions to submit.');
            return;
        }

        if (Object.keys(answers).length !== questions.length) {
            setError('Please answer all the questions.');
            return;
        }

        if (!validateAnswers()) {
            return;
        }

        setUploading(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/answers/${jobId}`, {
                job_id: jobId,
                answers: Object.keys(answers).map((questionId) => ({
                    question_id: questionId,
                    answer: answers[questionId]
                }))
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setError('Answers submitted successfully.');
        } catch (error) {
            setError('An error occurred while submitting the answers: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (cvOption === 'existing' && !cvId) {
            setError('Please select a CV from the list.');
            return;
        }

        if (coverLetterId === null && coverLetter) {
            await handleSaveCoverLetter();
        }

        if (coverLetterId !== null || !coverLetter) {
            if (!showQuestions || (showQuestions && validateAnswers())) {
                onSubmit(cvId, coverLetterId, answers);
                onClose();
            } else {
                setError('Please answer all the questions before finalizing the application.');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm Application</h2>
                <p className="mb-4 text-gray-600">Are you sure you want to apply for this job?</p>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">CV Options</h3>
                    <div className="mb-4 flex space-x-4">
                        <button
                            onClick={() => handleCVOptionClick('existing')}
                            className={`px-4 py-2 rounded-lg text-white ${cvOption === 'existing' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        >
                            Select existing CV
                        </button>
                        <button
                            onClick={() => handleCVOptionClick('new')}
                            className={`px-4 py-2 rounded-lg text-white ${cvOption === 'new' ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'}`}
                        >
                            Create new CV
                        </button>
                    </div>

                    {cvOption === 'existing' && (
                        <div className="mb-4">
                            <label className="block mb-2 text-gray-600">Select existing CV:</label>
                            <select
                                value={cvId || ''}
                                onChange={(e) => setCvId(e.target.value)}
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                <option value="" disabled>Select a CV</option>
                                {cvList.length > 0 ? (
                                    cvList.map((cv) => (
                                        <option key={cv.id} value={cv.id}>
                                            {cv.title}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No CVs available</option>
                                )}
                            </select>
                        </div>
                    )}
                </div>

                {showCoverLetter && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Cover Letter</h3>
                        <div className="mb-4">
                            <textarea
                                value={coverLetter}
                                onChange={handleCoverLetterChange}
                                placeholder="Write your cover letter here..."
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        <button
                            onClick={handleSaveCoverLetter}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={uploading}
                        >
                            {uploading ? 'Saving...' : 'Save Cover Letter'}
                        </button>
                    </div>
                )}

                {showQuestions && questions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Answer the following questions:</h3>
                        {questions.map((question) => (
                            <div key={question.id} className="mb-4">
                                <label className="block mb-2 text-gray-600">{question.question}</label>
                                <input
                                    type={question.answer_type === 'integer' ? 'number' : 'text'}
                                    value={answers[question.id] || ''}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    placeholder={question.answer_type === 'integer' ? 'Enter a number' : 'Enter your answer'}
                                    min={question.answer_type === 'integer' ? question.min_value : undefined}
                                    max={question.answer_type === 'integer' ? question.max_value : undefined}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSubmitAnswers}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={uploading}
                        >
                            {uploading ? 'Submitting...' : 'Submit Answers'}
                        </button>
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        disabled={uploading}
                    >
                        {uploading ? 'Submitting...' : 'Submit Application'}
                    </button>
                </div>
            </div>
        </div>
    );
};

Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    jobId: PropTypes.number.isRequired,
};

export default Popup;
