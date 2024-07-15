import  { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
                    const providerId = response.data.id;
                    axios.get('http://127.0.0.1:8000/api/joblist', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then(response => {
                            const providerJobs = response.data.filter(job => job.provider_id === providerId);
                            setJobs(providerJobs);
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error('Error fetching jobs:', error);
                            setLoading(false);
                        });
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginprovider');
        }
    }, [navigate]);

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Created Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : jobs.length > 0 ? (
                    <div>
                        {jobs.map(job => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">{job.title}</p>
                                <p className="text-gray-700">{job.description}</p>
                                <div className='flex justify-end'>

                                    <button
                                        className='m-2 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-900 transition duration-200'>edit job
                                    </button>
                                    <button
                                        className='m-2 px-4 py-2 bg-red-700 text-white  rounded hover:bg-red-900 transition duration-200'>delete
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
        </div>
    );
};

export default CreatedJobs;
