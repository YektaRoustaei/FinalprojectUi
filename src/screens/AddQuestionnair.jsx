import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AddQuestionnaire = ({ onQuestionnaireAdded }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([{ question: "", answerType: "string", minValue: "", maxValue: "" }]);
    const [jobId, setJobId] = useState(null);

    // Extract job-id from URL query parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const id = queryParams.get('job-id');
        if (id) {
            setJobId(id);
        } else {
            toast.error("Job ID is missing");
        }
    }, [location.search]);

    const validateQuestionnaireForm = () => {
        for (const q of questions) {
            if (!q.question || !q.answerType || (q.answerType === 'int' && q.minValue === "")) {
                toast.error('Please fill out all required fields.');
                return false;
            }
            if (q.answerType === 'int' && (isNaN(q.minValue) || (q.maxValue && isNaN(q.maxValue)))) {
                toast.error('Min and Max values must be numbers.');
                return false;
            }
        }
        return true;
    };

    const handleAddQuestionnaire = async (e) => {
        e.preventDefault();

        if (!validateQuestionnaireForm()) {
            return;
        }

        try {
            const token = localStorage.getItem('Provider_token');
            const response = await axios.post('http://127.0.0.1:8000/api/provider/jobs/question/create', {
                job_id: jobId,
                questions: questions.map(q => ({
                    question: q.question,
                    answer_type: q.answerType,
                    min_value: q.minValue || null,
                    max_value: q.maxValue || null
                }))
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 201) {
                toast.success('Questionnaire added successfully');
                if (typeof onQuestionnaireAdded === 'function') {
                    onQuestionnaireAdded();
                }
                // Clear form fields
                setQuestions([{ question: "", answerType: "string", minValue: "", maxValue: "" }]);
                // Navigate to provider-dashboard
                navigate('/provider-dashboard');
            } else {
                toast.error('Failed to add questionnaire.');
            }
        } catch (err) {
            console.error('Error adding questionnaire: ', err.response ? err.response.data : err.message);
            toast.error(`Error adding questionnaire: ${err.response ? err.response.data.detail : err.message}`);
        }
    };

    const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [name]: value };
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", answerType: "string", minValue: "", maxValue: "" }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <form className="space-y-4" onSubmit={handleAddQuestionnaire}>
                    {questions.map((q, index) => (
                        <div key={index} className="border p-4 rounded mb-4">
                            <div className="mb-4">
                                <label htmlFor={`question-${index}`} className="block text-gray-700 font-bold mb-2">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    id={`question-${index}`}
                                    name="question"
                                    className="border rounded w-full py-2 px-3"
                                    placeholder="Enter the question"
                                    value={q.question}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor={`answer_type-${index}`} className="block text-gray-700 font-bold mb-2">
                                    Answer Type
                                </label>
                                <select
                                    id={`answer_type-${index}`}
                                    name="answerType"
                                    className="border rounded w-full py-2 px-3"
                                    value={q.answerType}
                                    onChange={(e) => handleInputChange(index, e)}
                                    required
                                >
                                    <option value="string">String</option>
                                    <option value="int">Integer</option>
                                </select>
                            </div>
                            {q.answerType === 'int' && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor={`min_value-${index}`} className="block text-gray-700 font-bold mb-2">
                                            Minimum Value
                                        </label>
                                        <input
                                            type="number"
                                            id={`min_value-${index}`}
                                            name="minValue"
                                            className="border rounded w-full py-2 px-3"
                                            placeholder="Minimum value"
                                            value={q.minValue}
                                            onChange={(e) => handleInputChange(index, e)}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor={`max_value-${index}`} className="block text-gray-700 font-bold mb-2">
                                            Maximum Value (optional)
                                        </label>
                                        <input
                                            type="number"
                                            id={`max_value-${index}`}
                                            name="maxValue"
                                            className="border rounded w-full py-2 px-3"
                                            placeholder="Maximum value"
                                            value={q.maxValue}
                                            onChange={(e) => handleInputChange(index, e)}
                                        />
                                    </div>
                                </>
                            )}
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => handleRemoveQuestion(index)}
                            >
                                Remove Question
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleAddQuestion}
                    >
                        Add Another Question
                    </button>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Add Questions
                    </button>
                </form>
            </div>
        </div>
    );
};

// Define prop types
AddQuestionnaire.propTypes = {
    onQuestionnaireAdded: PropTypes.func.isRequired,
};

export default AddQuestionnaire;
