import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Seeker_token');

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
    }, [navigate]);

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

    const truncateDescription = (description) => {
        // Split description by lines and take the first 3 lines
        const lines = description.split('\n').slice(0, 3);
        return lines.join('\n'); // Join the first 3 lines back into a string
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : savedJobs.length > 0 ? (
                    <div>
                        {savedJobs.map(savedJob => {
                            const jobDetail = jobDetails[savedJob.job_id];
                            return (
                                <div key={savedJob.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-xl mb-4">
                                    {jobDetail ? (
                                        <>
                                            <p className="text-lg font-semibold mb-2">{jobDetail.title}</p>
                                            <p className="text-gray-700">{truncateDescription(jobDetail.description)}</p>
                                            <p className="text-gray-700">Company: {jobDetail.provider.company_name}</p>
                                            <p className="text-gray-700">Location: {jobDetail.provider.address}</p>
                                        </>
                                    ) : (
                                        <p>Loading job details...</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-600">No saved jobs available.</div>
                )}
                <button
                    onClick={() => navigate('/seeker-dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SavedJobs;
