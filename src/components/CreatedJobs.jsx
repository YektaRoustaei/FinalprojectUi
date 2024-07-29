import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreatedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Provider_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/provider/get-info', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    const providerJobs = response.data.jobs;
                    setJobs(providerJobs);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching provider info:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginprovider');
        }
    }, [navigate]);

    const handleEdit = (jobId) => {
        navigate(`/updatejob/${jobId}`);
    };
    const handleApplication = (jobId) => {
        navigate(`/applications/${jobId}`);
    };

    const handleDelete = (jobId) => {
        const token = localStorage.getItem('Provider_token');
        if (window.confirm('Are you sure you want to delete this job?')) {
            axios.delete(`http://127.0.0.1:8000/api/deletejob/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    setJobs(jobs.filter(job => job.id !== jobId));
                    toast.success('Job deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting job:', error);
                    toast.error('Failed to delete job. Please try again.');
                });
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Created Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : jobs.length > 0 ? (
                    <div>
                        {jobs.map(job => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">{job.title}</p>
                                <p className="text-gray-700 mb-2">{job.description}</p>
                                <p className="text-gray-700 mb-2"><strong>Type:</strong> {job.type}</p>
                                <p className="text-gray-700 mb-2"><strong>Salary:</strong> ${job.salary}</p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Skills:</strong> {job.skills.join(', ')}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Categories:</strong> {job.categories.join(', ')}
                                </p>
                                <div className='flex justify-end'>
                                    <button
                                        onClick={() => handleApplication(job.id)}
                                        className='m-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-900 transition duration-200'>
                                        Applications
                                    </button>
                                    <button
                                        onClick={() => handleEdit(job.id)}
                                        className='m-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 transition duration-200'>
                                        Edit Job
                                    </button>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className='m-2 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900 transition duration-200'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">No jobs created by this user.</div>
                )}
                <button
                    onClick={() => navigate('/provider-dashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
            {/* Add ToastContainer for toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default CreatedJobs;
