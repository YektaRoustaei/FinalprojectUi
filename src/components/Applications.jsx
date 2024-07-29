import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Applications = () => {
    const { id } = useParams(); // Get id from URL params
    const [applications, setApplications] = useState([]);
    const [jobDetails, setJobDetails] = useState({});
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications(); // Fetch applications when component mounts
    }, [id]); // Depend on id

    const fetchApplications = async () => {
        setLoading(true);
        const token = localStorage.getItem('Provider_token'); // Get token from localStorage

        if (!id) {
            setError('Job ID is missing.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/provider/jobs/applications', {
                params: { job_id: id },
                headers: { Authorization: `Bearer ${token}` }
            });
            const apps = response.data;
            setApplications(apps);

            // Extract job_ids and fetch job details
            const jobIds = apps.map(app => app.job_id);
            fetchJobDetails(jobIds);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchJobDetails = async (jobIds) => {
        try {
            const jobIdParams = jobIds.map(id => `job_id=${id}`).join('&');
            const response = await axios.get(`http://127.0.0.1:8000/api/joblist?${jobIdParams}`);
            const jobDetailsMap = response.data.reduce((acc, job) => {
                acc[job.id] = job;
                return acc;
            }, {});
            setJobDetails(jobDetailsMap);
        } catch (error) {
            console.error('Error fetching job details:', error);
        }
    };

    const handleToggleDetails = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const handleAction = (applicationId, action) => {
        const token = localStorage.getItem('Provider_token');
        if (token) {
            axios.post(`http://127.0.0.1:8000/api/provider/jobs/applications/${action}`, {
                applied_job_id: applicationId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => {
                    // Refresh applications after action
                    refreshApplications();
                })
                .catch(error => {
                    console.error(`Error updating application status to ${action}:`, error);
                    alert(`Failed to ${action} application: ${error.response?.data?.error || error.message}`);
                });
        }
    };

    const refreshApplications = () => {
        // Fetch applications again
        fetchApplications();
    };

    const getStatusBorderClass = (status) => {
        switch (status) {
            case 'accepted':
                return 'border-green-500';
            case 'rejected':
                return 'border-red-500';
            default:
                return '';
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Applications for Job ID: {id}</h1>
                {applications.length > 0 ? (
                    <div>
                        {applications.map((application, index) => {
                            const jobDetail = jobDetails[application.job_id];
                            return (
                                <div
                                    key={application.applied_job_id}
                                    className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-lg"
                                >
                                    <h3 className="text-lg font-semibold mb-2">Job Details</h3>
                                    {jobDetail ? (
                                        <>
                                            <p className="text-gray-700">Title: {jobDetail.title}</p>
                                            <p className="text-gray-700">Description: {jobDetail.description}</p>
                                            <p className="text-gray-700">Company: {jobDetail.provider.company_name}</p>
                                            <p className="text-gray-700">Location: {jobDetail.provider.address}</p>
                                        </>
                                    ) : (
                                        <p>Loading job details...</p>
                                    )}
                                    <h3 className="text-lg font-semibold mt-4 mb-2">Seeker Details</h3>
                                    <p className="text-gray-700">Name: {application.seeker.first_name} {application.seeker.last_name}</p>
                                    <p className="text-gray-700">Email: {application.seeker.email}</p>
                                    <p className="text-gray-700">Phone: {application.seeker.phonenumber}</p>

                                    <button
                                        onClick={() => handleToggleDetails(index)}
                                        className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                                    >
                                        {expanded === index ? 'Show Less' : 'Show CV Details'}
                                    </button>

                                    {expanded === index && (
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">CV Details</h3>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold">Skills</h3>
                                                <ul className="list-disc ml-5">
                                                    {application.skills.length > 0 ? (
                                                        application.skills.map((skill, idx) => (
                                                            <li key={idx} className="text-gray-700">{skill}</li>
                                                        ))
                                                    ) : (
                                                        <li className="text-gray-700">No skills listed</li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold mt-4">Cover Letter</h3>
                                                <p className="text-gray-700">Content: {application.cover_letter.content}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 flex justify-end space-x-4">
                                        {application.status === 'hold' ? (
                                            <>
                                                <button
                                                    onClick={() => handleAction(application.applied_job_id, 'accept')}
                                                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(application.applied_job_id, 'reject')}
                                                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <p className={`text-gray-700 ${getStatusBorderClass(application.status)} border-2 inline-block p-2 rounded`}>
                                                Status: {application.status}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-gray-600">No applications available.</div>
                )}
                <button
                    onClick={() => navigate('/provider-dashboard/jobs')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                >
                    Back to All Jobs
                </button>
            </div>
        </div>
    );
};

export default Applications;
