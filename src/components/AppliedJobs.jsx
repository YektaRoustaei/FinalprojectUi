import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('Seeker_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/seeker/applied-jobs', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setAppliedJobs(response.data);
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

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Applied Jobs</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : appliedJobs.length > 0 ? (
                    <div>
                        {appliedJobs.map(job => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">{job.title}</p>
                                <p className="text-gray-700">{job.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">No applied jobs available.</div>
                )}
                <button
                    onClick={() => navigate('/seekerdashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default AppliedJobs;
