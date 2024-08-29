import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSackDollar, faLocationDot, faBuilding, faTimes } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup'; // Ensure Popup is imported

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('Seeker_token');

    useEffect(() => {
        if (token) {
            axios.get('http://127.0.0.1:8000/api/seeker/get-info', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const savedJobsData = response.data.saved_jobs;
                    setSavedJobs(savedJobsData);
                    fetchJobDetails(savedJobsData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching saved jobs:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginseeker');
        }
    }, [navigate, token]);

    const fetchJobDetails = (savedJobs) => {
        const jobIds = savedJobs.map(job => job.job_id);
        axios.get('http://127.0.0.1:8000/api/joblist', {
            params: {
                ids: jobIds.join(',')
            }
        })
            .then(response => {
                const jobDetailsMap = response.data.reduce((acc, job) => {
                    acc[job.id] = job;
                    return acc;
                }, {});
                setJobDetails(jobDetailsMap);
            })
            .catch(error => {
                console.error('Error fetching job details:', error);
            });
    };

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setIsPopupOpen(true);
    };

    const handleUnsaveClick = async (jobId) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/unsave', {
                job_id: jobId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSavedJobs(savedJobs.filter(job => job.job_id !== jobId));
            console.log(response.data.message);
        } catch (error) {
            console.error('Failed to unsave the job:', error.response ? error.response.data : error.message);
        }
    };

    const handleApplySubmit = async (cvId, coverLetterId) => {
        if (selectedJob) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/seeker/jobs/apply', {
                    job_id: selectedJob.id,
                    curriculum_vitae_id: cvId,
                    cover_letter_id: coverLetterId,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response.data.message);
                setIsPopupOpen(false);
            } catch (error) {
                console.error('Apply job error:', error.response ? error.response.data : error.message);
            }
        }
    };

    const truncateDescription = (description) => {
        const lines = description.split('\n').slice(0, 3);
        return lines.join('\n');
    };

    return (
        <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Saved Jobs</h1>
            {loading ? (
                <div className="text-gray-600">Loading...</div>
            ) : savedJobs.length > 0 ? (
                <div className="space-y-4">
                    {savedJobs.map(savedJob => {
                        const jobDetail = jobDetails[savedJob.job_id];
                        return (
                            <div key={savedJob.id} className="relative p-4 border border-gray-200 rounded-lg shadow-sm dark:border-gray-600">
                                {jobDetail ? (
                                    <>
                                        {/* Job Content */}
                                        <div className="mb-8">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{jobDetail.title}</h2>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Posted by <span className="font-semibold text-gray-700 dark:text-white">{jobDetail.provider.company_name}</span></p>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-gray-700 dark:text-gray-400">
                                                    <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                                    <span>{jobDetail.provider.company_name}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700 dark:text-gray-400">
                                                    <FontAwesomeIcon icon={faSackDollar} className="mr-2" />
                                                    <span>${jobDetail.salary}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700 dark:text-gray-400">
                                                    <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                                                    <span>{jobDetail.type}</span>
                                                </div>
                                                <div className="flex items-center text-gray-700 dark:text-gray-400">
                                                    <FontAwesomeIcon icon={faLocationDot} className="mr-2" />
                                                    <span>{jobDetail.provider.city.city_name}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-400 mb-4">{truncateDescription(jobDetail.description)}</p>
                                            <div className="mt-4 flex flex-wrap">
                                                {jobDetail.job_skills && jobDetail.job_skills.length > 0 && jobDetail.job_skills.map((jobSkill, index) => {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`inline-block text-sm px-2 py-1 rounded-full mr-2 mb-2 bg-gray-200 text-gray-800`}
                                                        >
                                                            {jobSkill}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* Unsave Button */}
                                        <button
                                            className="absolute bg-red-600 bottom-2 right-2 text-white hover:bg-red-700 rounded-lg flex items-center px-4 py-2"
                                            onClick={() => handleUnsaveClick(savedJob.job_id)}
                                        >
                                            <span className='mr-1'>Unsave</span>
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                        {/* Apply Button */}
                                        <div className="flex justify-between items-center mt-4">
                                            <button className="px-4 py-2 bg-blue-900 text-white rounded-lg" onClick={() => handleApplyClick(jobDetail)}>Apply</button>
                                        </div>
                                    </>
                                ) : (
                                    <p>Loading job details...</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">No saved jobs available.</p>
                    <button
                        onClick={() => navigate('/seeker-dashboard')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>
            )}
            {isPopupOpen && selectedJob && (
                <Popup
                    onClose={() => setIsPopupOpen(false)}
                    onSubmit={handleApplySubmit}
                    jobId={selectedJob.id} // Pass the jobId to Popup
                />
            )}
        </div>
    );
};

export default SavedJobs;
