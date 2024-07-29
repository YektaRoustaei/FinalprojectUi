import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Provider_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/seeker/get-info', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const jobs = response.data.applied_jobs;
                    setAppliedJobs(jobs);
                    fetchJobDetails(jobs.map(job => job.job_id));
                })
                .catch(error => {
                    console.error('Error fetching applied jobs:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginseeker');
        }
    }, [navigate]);

    const fetchJobDetails = (jobIds) => {
        axios.get('http://127.0.0.1:8000/api/joblist', {
            params: { ids: jobIds.join(',') }
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

    const statusColor = (status) => {
        switch (status) {
            case 'accepted':
                return 'bg-green-500';
            case 'hold':
                return 'bg-yellow-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const handleJobClick = (jobId) => {
        navigate(`/provider-dashboard/ManageApplications/${jobId}`);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : appliedJobs.length > 0 ? (
                    <div>
                        {appliedJobs.map(appliedJob => {
                            const jobDetail = jobDetails[appliedJob.job_id];
                            return (
                                <div
                                    key={appliedJob.job_id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-xl mb-4 cursor-pointer"
                                    onClick={() => handleJobClick(appliedJob.job_id)}
                                >
                                    {jobDetail ? (
                                        <>
                                            <p className="text-lg font-semibold mb-2">{jobDetail.title}</p>
                                            <p className="text-gray-700">{jobDetail.description}</p>
                                            <p className="text-gray-700">Company: {jobDetail.provider.company_name}</p>
                                            <p className="text-gray-700">Location: {jobDetail.provider.address}</p>
                                        </>
                                    ) : (
                                        <p>Loading job details...</p>
                                    )}
                                    <p className="text-gray-700">Applied At: {new Date(appliedJob.created_at).toLocaleString()}</p>
                                    <div className='flex justify-end'>
                                        <p className={`text-white w-1/12 text-center rounded-lg ${statusColor(appliedJob.status)}`}>
                                            {appliedJob.status.charAt(0).toUpperCase() + appliedJob.status.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-600">No applied jobs available.</div>
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

export default AppliedJobs;
