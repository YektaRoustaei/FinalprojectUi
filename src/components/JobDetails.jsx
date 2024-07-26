import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSackDollar, faLocationDot, faBuilding, faBookmark, faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';

const JobDetails = () => {
    const location = useLocation();
    const { job, companyName, address } = location.state;
    const [isSaved, setIsSaved] = useState(false);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('Seeker_token');

    if (!job) return <div>Loading...</div>;

    // Function to handle saving or unsaving job
    const handleSaveClick = () => {
        if (isSaved) {
            unsaveJob();
        } else {
            saveJob();
        }
    };

    // Function to save the job
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

    // Function to unsave the job
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Posted by <span className="font-semibold text-gray-700 dark:text-white">{companyName}</span></p>
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                    <span>{companyName}</span>
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
                    <span>{address}</span>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-400 mb-4">{job.description}</p>
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

JobDetails.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        salary: PropTypes.string,
        description: PropTypes.string.isRequired,
        location: PropTypes.string,
        provider_id: PropTypes.number.isRequired,
    }).isRequired,
    companyName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
};

export default JobDetails;