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
    const [answersSubmitted, setAnswersSubmitted] = useState(false); // State to track if answers have been submitted
    const [showCoverLetter, setShowCoverLetter] = useState(false); // State to control cover letter visibility
    const token = localStorage.getItem('Seeker_token');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch available CVs when the component mounts
        const fetchCVList = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/seeker/cv/info', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.data.curriculum_vitae_id) {
                    setCvList([{ id: response.data.curriculum_vitae_id, name: 'Your CV' }]);
                } else {
                    setCvList(response.data.cvs || []);
                }
            } catch (error) {
                console.error('Error fetching CV list:', error.response ? error.response.data : error.message);
            }
        };

        fetchCVList();
    }, [token]);

    useEffect(() => {
        // Fetch questions based on the jobId when the component mounts or jobId changes
        if (jobId) {
            const fetchQuestions = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/questions/${jobId}`);
                    setQuestions(response.data.data);
                } catch (error) {
                    console.error('Error fetching questions:', error.response ? error.response.data : error.message);
                }
            };

            fetchQuestions();
        }
    }, [jobId]);

    useEffect(() => {
        // Fetch job details to determine if cover letter should be shown
        if (jobId) {
            const fetchJobDetails = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/job/${jobId}`);
                    setShowCoverLetter(response.data.cover_letter === 1);
                } catch (error) {
                    console.error('Error fetching job details:', error.response ? error.response.data : error.message);
                }
            };

            fetchJobDetails();
        }
    }, [jobId]);

    const handleCVOptionClick = (option) => {
        setCvOption(option);
        if (option === 'new') {
            navigate('/seeker/cv');
        }
    };

    const handleCoverLetterChange = (event) => setCoverLetter(event.target.value);

    const handleSaveCoverLetter = async () => {
        if (!coverLetter) {
            alert('Please write a cover letter.');
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
            alert('Cover letter saved successfully.');
        } catch (error) {
            console.error('Cover letter saving error:', error.response ? error.response.data : error.message);
            alert('An error occurred while saving the cover letter: ' + (error.response?.data?.message || error.message));
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

    const handleSubmitAnswers = async () => {
        if (Object.keys(answers).length === 0) {
            alert('Please answer all the questions.');
            return;
        }

        setUploading(true);
        try {
            // POST answers to the correct route with jobId
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
            setAnswersSubmitted(true);
            alert('Answers submitted successfully.');
        } catch (error) {
            console.error('Answers submission error:', error.response ? error.response.data : error.message);
            alert('An error occurred while submitting the answers: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (cvOption === 'existing' && !cvId) {
            alert('Please select a CV from the list.');
            return;
        }

        if (coverLetterId === null && coverLetter) {
            await handleSaveCoverLetter();
        }

        if (coverLetterId !== null || !coverLetter) {
            if (answersSubmitted) {
                onSubmit(cvId, coverLetterId, answers);
                onClose();
            } else {
                alert('Please submit your answers before finalizing the application.');
            }
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm Application</h2>
                <p className="mb-4 text-gray-600">Are you sure you want to apply for this job?</p>

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
                                            {cv.name}
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
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Cover Letter (Optional)</h3>
                        <div className="mb-4">
                            <label className="block mb-2 text-gray-600">Write your cover letter:</label>
                            <textarea
                                rows="4"
                                value={coverLetter}
                                onChange={handleCoverLetterChange}
                                placeholder="Write your cover letter here..."
                                className="block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                            />
                        </div>
                        {coverLetter && (
                            <button
                                onClick={handleSaveCoverLetter}
                                className={`px-4 py-2 rounded-lg ${uploading ? 'bg-gray-400' : 'bg-blue-600'} text-white hover:bg-blue-700`}
                                disabled={uploading}
                            >
                                {uploading ? 'Saving...' : 'Save Cover Letter'}
                            </button>
                        )}
                    </div>
                )}

                {questions.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">Questions</h3>
                        {questions.map((question) => (
                            <div key={question.id} className="mb-4">
                                <label className="block mb-2 text-gray-600">{question.question}</label>
                                <input
                                    type={question.answer_type === 'int' ? 'number' : 'text'}
                                    min={question.min_value || undefined}
                                    max={question.max_value || undefined}
                                    value={answers[question.id] || ''}
                                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                                    placeholder="Your answer here..."
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                />
                            </div>
                        ))}
                        <button
                            onClick={handleSubmitAnswers}
                            className={`px-4 py-2 rounded-lg ${uploading ? 'bg-gray-400' : 'bg-blue-600'} text-white hover:bg-blue-700`}
                            disabled={uploading}
                        >
                            {uploading ? 'Submitting...' : 'Submit Answers'}
                        </button>
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${uploading ? 'bg-gray-400' : 'bg-blue-600'} text-white hover:bg-blue-700`}
                        onClick={handleSubmit}
                        disabled={uploading}
                    >
                        {uploading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Define prop types
Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    jobId: PropTypes.number.isRequired, // Ensure jobId is provided
};

export default Popup;
