import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
    const [applied_jobs, setApplied_jobs] = useState([]);
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
                    setApplied_jobs(response.data.applied_jobs);
                    fetchJobDetails(response.data.applied_jobs);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching applied jobs:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginseeker');
        }
    }, [navigate]);

    const fetchJobDetails = (applied_jobs) => {
        const jobIds = applied_jobs.map(job => job.job_id);
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

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : applied_jobs.length > 0 ? (
                    <div>
                        {applied_jobs.map(applied_job => {
                            const jobDetail = jobDetails[applied_job.job_id];
                            return (
                                <div key={applied_job.id} className="border border-gray-200 rounded-lg p-4  hover:border-gray-400 hover:shadow-xl mb-4">
                                    {jobDetail ? (
                                        <>
                                            <p className="text-lg font-semibold mb-2">{jobDetail.title}</p>
                                            <p className="text-gray-700">{jobDetail.description}</p>
                                            <p className="text-gray-700">Company: {jobDetail.provider.company_name}</p>
                                            <p className="text-gray-700">location: {jobDetail.provider.address}</p>

                                        </>
                                    ) : (
                                        <p>Loading job details...</p>
                                    )}
                                    <p className="text-gray-700">Applied At: {new Date(applied_job.created_at).toLocaleString()}</p>
                                    <div className='flex justify-end'>
                                        <p className='bg-red-700 text-white w-1/12 text-center rounded-lg '>Rejected</p>
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
