import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Applications = () => {
    const { id } = useParams();
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [expanded, setExpanded] = useState(null);
    const [showAnswers, setShowAnswers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [savedCvs, setSavedCvs] = useState([]);
    const [cvDetails, setCvDetails] = useState({});
    const navigate = useNavigate();

    console.log(cvDetails)
    console.log(jobDetails)

    useEffect(() => {
        fetchApplications();
        fetchSavedCvs();
    }, [id]);

    const fetchApplications = async () => {
        setLoading(true);
        const token = localStorage.getItem('Provider_token');

        if (!id) {
            setError('Job ID is missing.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/provider/jobs/applications', {
                params: { job_id: id },
                headers: { Authorization: `Bearer ${token}` }
            });

            setApplications(response.data);
            fetchJobDetails(id);
            fetchQuestions(id);
        } catch (error) {
            setError(error.response && error.response.status === 404 ? 'No applications found for this job' : 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedCvs = async () => {
        const token = localStorage.getItem('Provider_token');
        const providerId = jobDetails[id]?.provider?.id;

        if (!providerId) return;

        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/savedcv/list/${providerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSavedCvs(response.data.data);
        } catch (error) {
            console.error('Error fetching saved CVs:', error);
        }
    };

    const fetchJobDetails = async (jobId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/job/${jobId}`);
            setJobDetails({ [jobId]: response.data });
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const fetchQuestions = async (jobId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/questions/${jobId}`);
            setQuestions(response.data.data);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const fetchAnswers = async (jobId, seekerId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/getanswers/${jobId}/${seekerId}`);
            setAnswers(response.data || []);
        } catch (error) {
            console.error('Error fetching answers:', error);
            setAnswers([]);
        }
    };

    const handleToggleDetails = (index) => {
        const currentApplication = applications[index];
        if (expanded === index) {
            setExpanded(null);
        } else {
            setExpanded(index);
            setCvDetails(currentApplication.cv);
        }
        setShowAnswers(null);
    };

    const handleToggleAnswers = (index) => {
        setShowAnswers(showAnswers === index ? null : index);
        setExpanded(null);
        if (showAnswers !== index) {
            const seekerId = applications[index].seeker.id;
            fetchAnswers(id, seekerId);
        }
    };

    const handleAction = (applicationId, action) => {
        const token = localStorage.getItem('Provider_token');
        if (token) {
            axios.post(`http://127.0.0.1:8000/api/provider/jobs/applications/${action}`, {
                applied_job_id: applicationId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    refreshApplications();
                })
                .catch(error => {
                    console.error(`Error updating application status to ${action}:`, error);
                    alert(`Failed to ${action} application: ${error.response?.data?.error || error.message}`);
                });
        }
    };

    const refreshApplications = () => {
        fetchApplications();
    };

    const getStatusBorderClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'border-green-500';
            case 'rejected':
                return 'border-red-500';
            default:
                return '';
        }
    };

    const handleSaveForFuture = (application) => {
        const token = localStorage.getItem('Provider_token');

        if (!token) {
            alert('Authorization token is missing.');
            return;
        }

        const cvId = application.cv.id;
        const providerId = jobDetails[id]?.provider?.id;
        const seekerId = application.seeker.id;

        if (!providerId || !cvId || !seekerId) {
            alert('Required data is missing.');
            return;
        }

        const isCvSaved = savedCvs.some(cv => cv.curriculum_vitae_id === cvId);
        const url = isCvSaved ? 'http://127.0.0.1:8000/api/cv/unsave' : 'http://127.0.0.1:8000/api/cv/save';
        const payload = {
            curriculum_vitae_id: cvId,
            provider_id: providerId,
            seeker_id: seekerId
        };

        axios.post(url, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert(`${isCvSaved ? 'Unsave' : 'Save'} CV for Future ${isCvSaved ? 'successfully' : 'successfully'}.`);
                fetchSavedCvs(); // Refresh the saved CVs list
            })
            .catch(error => {
                console.error(`${isCvSaved ? 'Unsave' : 'Save'} CV for Future error:`, error);
                alert(`Failed to ${isCvSaved ? 'unsave' : 'save'} CV for future: ${error.response?.data?.error || error.message}`);
            });
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
                <h1 className="text-4xl font-bold mb-6">Applications for Job ID: {id}</h1>
                {error ? (
                    <div className="text-red-600 text-center">{error}</div>
                ) : (
                    <>
                        {applications.length > 0 ? (
                            <div>
                                {applications.map((application, index) => {
                                    const jobDetail = jobDetails[id];
                                    const isExpanded = expanded === index;
                                    const isAnswersVisible = showAnswers === index;
                                    return (
                                        <div
                                            key={application.applied_job_id}
                                            className={`border ${getStatusBorderClass(application.status)} rounded-lg p-6 mb-4 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out`}
                                        >
                                            <h3 className="text-xl font-semibold mb-4">Job Details</h3>
                                            {jobDetail ? (
                                                <>
                                                    <p className="text-gray-800 mb-2"><strong>Title:</strong> {jobDetail.title}</p>
                                                    <p className="text-gray-800 mb-2"><strong>Description:</strong> {jobDetail.description}</p>
                                                    <p className="text-gray-800 mb-2"><strong>Company:</strong> {jobDetail.provider.company_name}</p>
                                                    <p className="text-gray-800 mb-2"><strong>Expiry Date:</strong> {jobDetail.expiry_date}</p>
                                                </>
                                            ) : (
                                                <p>Loading job details...</p>
                                            )}

                                            <h3 className="text-xl font-semibold mt-6 mb-4">Seeker Details</h3>
                                            <p className="text-gray-800 mb-2"><strong>Name:</strong> {application.seeker.first_name} {application.seeker.last_name}</p>
                                            <p className="text-gray-800 mb-2"><strong>Email:</strong> {application.seeker.email}</p>
                                            <p className="text-gray-800 mb-4"><strong>Phone:</strong> {application.seeker.phonenumber}</p>

                                            <div className="flex space-x-2">
                                                {jobDetail && jobDetail.question > 0 && (
                                                    <button
                                                        onClick={() => handleToggleAnswers(index)}
                                                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-300"
                                                    >
                                                        {isAnswersVisible ? 'Hide Answers' : 'Show Answers'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleDetails(index)}
                                                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                                >
                                                    {isExpanded ? 'Show Less' : 'Show CV Details'}
                                                </button>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-6">
                                                    <h3 className="text-xl font-semibold mb-4">CV Details</h3>
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold">Job Experiences</h4>
                                                        <ul className="list-disc pl-5">
                                                            {cvDetails?.job_experiences?.map((exp) => (
                                                                <li key={exp.id} className="mb-3">
                                                                    <p><strong>Company:</strong> {exp.company_name}</p>
                                                                    <p><strong>Position:</strong> {exp.position}</p>
                                                                    <p><strong>Description:</strong> {exp.description}
                                                                    </p>
                                                                    <p><strong>Start Date:</strong> {exp.start_date}</p>
                                                                    <p><strong>End
                                                                        Date:</strong> {exp.end_date || 'Present'}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold">Education</h4>
                                                        <ul className="list-disc pl-5">
                                                            {cvDetails?.educations?.map((edu) => (
                                                                <li key={edu.id} className="mb-3">
                                                                    <p><strong>Institution:</strong> {edu.institution}
                                                                    </p>
                                                                    <p><strong>Degree:</strong> {edu.degree}</p>
                                                                    <p><strong>Field of
                                                                        Study:</strong> {edu.field_of_study}</p>
                                                                    <p><strong>Start Date:</strong> {edu.start_date}</p>
                                                                    <p><strong>End Date:</strong> {edu.end_date}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>


                                                    <div className="mb-4">
                                                        <h4 className="text-lg font-semibold">Skills</h4>
                                                        <p className="text-lg text-red-600">{application.matched_skills_count} matching
                                                            skills</p>


                                                        <ul className="list-disc pl-5">
                                                        {cvDetails?.seeker_skills?.map((skillObj) => (
                                                                <li key={skillObj.id} className="mb-3">
                                                                    <p>{skillObj.skill.name}</p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                    <h4 className="text-lg font-semibold">Cover Letter</h4>
                                                        <p className="text-gray-800">
                                                            {cvDetails?.cover_letter || 'Cover letter not provided.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}


                                            {isAnswersVisible && (
                                                <div className="mt-6">
                                                    <h3 className="text-xl font-semibold mb-4">Questions and
                                                        Answers</h3>
                                                    {questions.length > 0 ? (
                                                        questions.map((question) => {
                                                            const answer = answers.find((ans) => ans.question_id === question.id);
                                                            return (
                                                                <div key={question.id} className="mb-4">
                                                                    <p className="text-gray-800 mb-2">
                                                                        <strong>Question:</strong> {question.question}
                                                                    </p>
                                                                    <p className="text-gray-800">
                                                                        <strong>Answer:</strong> {answer ? answer.answer : 'No answer provided'}
                                                                    </p>
                                                                </div>
                                                            );
                                                        })
                                                    ) : (
                                                        <p className="text-gray-800">No questions found.</p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-6 flex justify-end space-x-4">
                                                {application.status === 'hold' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'next')}
                                                            className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors duration-300"
                                                        >
                                                            Next Step
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'final')}
                                                            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                                                        >
                                                            Final Step
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'accept')}
                                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'reject')}
                                                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveForFuture(application)}
                                                            className={`px-4 py-2 ${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'text-black border border-black' : 'bg-black  border '}  font-semibold rounded-lg hover:${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'bg-black ' : 'border border-black text-white '} transition-colors duration-300`}
                                                        >
                                                            {savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'Unsave CV' : 'Save CV '}
                                                        </button>
                                                    </>
                                                ) : application.status === 'next_step' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'accept')}
                                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'reject')}
                                                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveForFuture(application)}
                                                            className={`px-4 py-2 ${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'bg-yellow-400' : 'bg-yellow-600'} text-white font-semibold rounded-lg hover:${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'bg-yellow-500' : 'bg-yellow-700'} transition-colors duration-300`}
                                                        >
                                                            {savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'Unsave CV' : 'Save CV '}
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'final')}
                                                            className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition-colors duration-300"
                                                        >
                                                            Final Step
                                                        </button>
                                                    </>
                                                ) : application.status === 'final_step' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'accept')}
                                                            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(application.applied_job_id, 'reject')}
                                                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                        >
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={() => handleSaveForFuture(application)}
                                                            className={`px-4 py-2 ${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'bg-yellow-400' : 'bg-yellow-600'}  font-semibold rounded-lg hover:${savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'bg-yellow-500' : 'bg-yellow-700'} transition-colors duration-300`}
                                                        >
                                                            {savedCvs.some(cv => cv.curriculum_vitae_id === application.cv.id) ? 'Unsave CV' : 'Save CV for Future'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <p className={`text-gray-700 ${getStatusBorderClass(application.status)} border-2 inline-block p-2 rounded`}>
                                                        Status: {application.status}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-gray-600 text-center">No applications found for this job.</div>
                        )}
                    </>
                )}
                <button
                    onClick={() => navigate('/provider-dashboard/jobs')}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                    Back to All Jobs
                </button>
            </div>
        </div>
    );
};

export default Applications;
