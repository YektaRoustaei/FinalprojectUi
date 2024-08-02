import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSackDollar, faLocationDot, faBuilding, faBookmark, faBookmark as faBookmarkSolid, faTimes } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup'; // Assuming you have a Popup component
import { useNavigate } from 'react-router-dom';

const JobAlert = () => {
    const [jobs, setJobs] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('Seeker_token');
    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/seekeralert', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setJobs(response.data.jobs);
            } catch (error) {
                setMessage('Failed to fetch jobs.');
                console.error('Fetch jobs error:', error.response ? error.response.data : error.message);
            }
        };

        fetchJobs();
    }, [token]);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsPopupOpen(true);
    };

    const handleSaveClick = async (jobId) => {
        if (isSaved) {
            await unsaveJob(jobId);
        } else {
            await saveJob(jobId);
        }
    };

    const saveJob = async (jobId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/save', {
                job_id: jobId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsSaved(true);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to save the job.');
            console.error('Save job error:', error.response ? error.response.data : error.message);
        }
    };

    const unsaveJob = async (jobId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/unsave', {
                job_id: jobId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsSaved(false);
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to unsave the job.');
            console.error('Unsave job error:', error.response ? error.response.data : error.message);
        }
    };

    const handleApplySubmit = (cvId, coverLetterId) => {
        if (selectedJob) {
            applyForJob(selectedJob.id, cvId, coverLetterId);
            setIsPopupOpen(false);
        }
    };

    const applyForJob = async (jobId, cvId, coverLetterId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/apply', {
                job_id: jobId,
                curriculum_vitae_id: cvId,
                cover_letter_id: coverLetterId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to apply for the job.';
            setMessage(errorMessage);
            console.error('Apply job error:', error.response ? error.response.data : error.message);
        }
    };

    const handleNotInterestedClick = async (jobId) => {
        try {
            await axios.post('http://127.0.0.1:8000/api/seeker/jobs/not-interested', {
                job_id: jobId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setJobs(jobs.filter(job => job.id !== jobId)); // Remove job from list
            setMessage('Job marked as not interested.');
            window.location.reload(); // Refresh the page
        } catch (error) {
            setMessage('Failed to mark job as not interested.');
            console.error('Not Interested error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Job Alerts</h1>
            {message && <p className="text-green-500">{message}</p>}
            <div className="space-y-4">
                {jobs.length > 0 ? jobs.map(job => (
                    <div key={job.id} className="relative p-4 border border-gray-200 rounded-lg shadow-sm dark:border-gray-600">
                        {/* Not Interested Button with Tooltip */}
                        <div className="relative">
                            <button
                                className="absolute top-2 right-2 text-red-600 hover:text-gray-900"
                                onClick={() => handleNotInterestedClick(job.id)}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                            <span className="absolute top-2 right-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                                Not Interested
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Posted by <span className="font-semibold text-gray-700 dark:text-white">{job.provider_name}</span></p>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-700 dark:text-gray-400">
                                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                <span>{job.provider_name}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-400">
                                <FontAwesomeIcon icon={faSackDollar} className="mr-2" />
                                <span>${job.salary}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-400">
                                <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                                <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-400">
                                <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                <span>{job.provider_city}</span>
                            </div>
                            {job.distance > 0 && (
                                <div className="flex items-center text-gray-700 dark:text-gray-400">
                                    <span className="text-red-500">Distance :</span>
                                    <span className="text-red-500">{Math.round(job.distance)} mile</span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-400 mb-4">{job.description}</p>
                        <div className="mt-4 flex flex-wrap">
                            {job.job_skills && job.job_skills.length > 0 && job.job_skills.map((jobSkill, index) => {
                                const isMatching = job.matching_skills && Object.values(job.matching_skills).includes(jobSkill);
                                return (
                                    <span
                                        key={index}
                                        className={`inline-block text-sm px-2 py-1 rounded-full mr-2 mb-2 ${isMatching ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {jobSkill}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg" onClick={() => handleApplyClick(job)}>Apply</button>
                            <button
                                className={`px-4 py-2 rounded-lg flex items-center transition duration-300 ${isSaved ? 'bg-red-600' : 'bg-gray-600'} text-white`}
                                onClick={() => handleSaveClick(job.id)}
                            >
                                <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmark} className="mr-2" />
                                {isSaved ? 'Unsave' : 'Save'}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-300 mb-4">No job alerts available.</p>
                        <button
                            onClick={() => navigate('/seeker-dashboard')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}
            </div>
            {isPopupOpen && selectedJob && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handleApplySubmit}
                />
            )}
        </div>
    );
};

export default JobAlert;
