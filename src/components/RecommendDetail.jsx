import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSackDollar, faLocationDot, faBuilding, faBookmark, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

const RecommendDetail = () => {
    const location = useLocation();
    const { job } = location.state;
    const [isSaved, setIsSaved] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('Seeker_token');

    if (!job) return <div>Loading...</div>;

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
            console.error(error);
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
            console.error(error);
        }
    };

    const handleApplyClick = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/apply', {
                job_id: job.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setMessage('Unauthorized. Please log in again.');
            } else {
                setMessage('Failed to apply for the job.');
            }
            console.error(error);
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{job.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Posted by <span className="font-semibold text-gray-700 dark:text-white">{job.company_name}</span></p>
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    <span>{job.company_name}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faSackDollar} className="mr-2" />
                    <span>{job.salary}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                    <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                    <span>{job.location}</span>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-400 mb-4">{job.description}</p>
            <div className="mt-4 flex flex-wrap">
                {job.job_skills && job.job_skills.length > 0 && job.job_skills.map((jobSkill, index) => {
                    const isMatching = job.matching_skills.includes(jobSkill);
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
            {message && <p className="text-green-500">{message}</p>}
            <div className="flex justify-between items-center">
                <button className="px-4 py-2 bg-blue-900 text-white rounded-lg" onClick={handleApplyClick}>Apply</button>
                <button
                    className={`px-4 py-2 rounded-lg flex items-center transition duration-300 ${isSaved ? 'bg-red-600' : 'bg-gray-600'} text-white`}
                    onClick={handleSaveClick}
                >
                    <FontAwesomeIcon icon={isSaved ? faBookmarkSolid : faBookmark} className="mr-2" />
                    {isSaved ? 'Unsave' : 'Save'}
                </button>
            </div>
        </div>
    );
};

export default RecommendDetail;
