import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Popup from './Popup'; // Ensure Popup is imported
import { faBriefcase, faSackDollar, faLocationDot, faBuilding, faBookmark, faBookmark as faBookmarkSolid, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const RecommendDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { job } = location.state || {};
    const [isSaved, setIsSaved] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [message, setMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [curriculumVitaeId, setCurriculumVitaeId] = useState('');
    const [coverLetterId, setCoverLetterId] = useState('');
    const token = localStorage.getItem('Seeker_token');

    useEffect(() => {
        if (job) {
            fetchJobStatus();
        }
    }, [job]);

    const fetchJobStatus = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/job-status/${job.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsApplied(response.data.applied_before);
            setIsSaved(response.data.saved_before);
        } catch (error) {
            console.error('Error fetching job status:', error.response ? error.response.data : error.message);
        }
    };

    const handleSaveClick = () => {
        if (isSaved) {
            unsaveJob();
        } else {
            saveJob();
        }
    };

    const saveJob = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/save', {
                job_id: job.id
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

    const unsaveJob = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/unsave', {
                job_id: job.id
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

    const applyForJob = async (cvId, coverLetterId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/apply', {
                job_id: job.id,
                curriculum_vitae_id: cvId,
                cover_letter_id: coverLetterId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
            setIsApplied(true);
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Failed to apply for the job.';
            setMessage(errorMessage);
            console.error('Apply job error:', error.response ? error.response.data : error.message);
        }
    };

    const handleApplyClick = () => {
        if (isApplied) {
            navigate('/seeker-dashboard/appliedjobs');
        } else {
            setIsPopupOpen(true);
        }
    };

    const handleApplySubmit = (cvId, coverLetterId) => {
        setCurriculumVitaeId(cvId);
        setCoverLetterId(coverLetterId);
        applyForJob(cvId, coverLetterId);
        setIsPopupOpen(false);
    };

    return (
        <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4">
            <div className="mb-4">
                <button
                    className="px-4 py-2 rounded-lg flex items-center border-2 border-blue-500"
                    onClick={() => navigate('/jobslist')}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back to Jobs List
                </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{job.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Posted by <span className="font-semibold text-gray-700 dark:text-white">{job.provider_name}</span></p>
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
            <div className="mt-4 flex flex-wrap mb-4">
                {Array.isArray(job.job_skills) && job.job_skills.length > 0 && job.job_skills.map((skill, index) => {
                    const isMatching = job.matching_skills && Object.values(job.matching_skills).includes(skill);
                    return (
                        <span
                            key={index}
                            className={`inline-block text-sm px-2 py-1 rounded-full mr-2 mb-2 ${isMatching ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {skill}
                        </span>
                    );
                })}
            </div>
            {message && <p className="text-green-500">{message}</p>}
            <div className="flex justify-between items-center">
                <button
                    className={`px-4 py-2 bg-blue-900 text-white rounded-lg ${isApplied ? 'bg-blue-600' : 'bg-blue-900'}`}
                    onClick={handleApplyClick}
                >
                    {isApplied ? 'Applied Before' : 'Apply'}
                </button>
                <button
                    className={`px-4 py-2 rounded-lg flex items-center transition duration-300 ${isSaved ? 'bg-red-600' : 'bg-gray-600'} text-white`}
                    onClick={handleSaveClick}
                >
                    <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmark} className="mr-2" />
                    {isSaved ? 'Unsave' : 'Save'}
                </button>
            </div>
            {isPopupOpen && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handleApplySubmit}
                    jobId={job.id} // Pass the jobId to Popup
                />
            )}
        </div>
    );
};

export default RecommendDetail;
