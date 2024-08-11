import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const AddQuestionnaire = ({ onQuestionnaireAdded }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [answerType, setAnswerType] = useState("string");
    const [minValue, setMinValue] = useState("");
    const [maxValue, setMaxValue] = useState("");
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
        if (!question || !answerType || (answerType === 'int' && minValue === "")) {
            toast.error('Please fill out all required fields.');
            return false;
        }
        if (answerType === 'int' && (isNaN(minValue) || (maxValue && isNaN(maxValue)))) {
            toast.error('Min and Max values must be numbers.');
            return false;
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
                question,
                answer_type: answerType,
                min_value: minValue || null,
                max_value: maxValue || null
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
                setQuestion("");
                setAnswerType("string");
                setMinValue("");
                setMaxValue("");
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <form className="space-y-4" onSubmit={handleAddQuestionnaire}>
                    <div className="mb-4">
                        <label htmlFor="question" className="block text-gray-700 font-bold mb-2">
                            Question
                        </label>
                        <input
                            type="text"
                            id="question"
                            name="question"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Enter the question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="answer_type" className="block text-gray-700 font-bold mb-2">
                            Answer Type
                        </label>
                        <select
                            id="answer_type"
                            name="answer_type"
                            className="border rounded w-full py-2 px-3"
                            value={answerType}
                            onChange={(e) => setAnswerType(e.target.value)}
                            required
                        >
                            <option value="string">String</option>
                            <option value="int">Integer</option>
                        </select>
                    </div>
                    {answerType === 'int' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="min_value" className="block text-gray-700 font-bold mb-2">
                                    Minimum Value
                                </label>
                                <input
                                    type="number"
                                    id="min_value"
                                    name="min_value"
                                    className="border rounded w-full py-2 px-3"
                                    placeholder="Minimum value"
                                    value={minValue}
                                    onChange={(e) => setMinValue(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="max_value" className="block text-gray-700 font-bold mb-2">
                                    Maximum Value (optional)
                                </label>
                                <input
                                    type="number"
                                    id="max_value"
                                    name="max_value"
                                    className="border rounded w-full py-2 px-3"
                                    placeholder="Maximum value"
                                    value={maxValue}
                                    onChange={(e) => setMaxValue(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                        Add Question
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
