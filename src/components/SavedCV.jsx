import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SavedCV = () => {
    const { providerId } = useParams(); // Get providerId from URL
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const token = localStorage.getItem('Provider_token');
        const fetchCvs = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/savedcv/list/${providerId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                setCvs(response.data.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCvs();
    }, [providerId]);

    const handleUnsave = async (cvId, seekerId) => {
        const token = localStorage.getItem('Provider_token');
        try {
            await axios.post(`http://127.0.0.1:8000/api/cv/unsave/`, {
                curriculum_vitae_id: cvId,
                provider_id: providerId,
                seeker_id: seekerId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setCvs(cvs.filter(cv => cv.curriculum_vitae_id !== cvId));
            toast.success('CV unsaved successfully!');
        } catch (err) {
            toast.error('Failed to unsave CV.');
        }
    };

    const handleNavigate = () => {
        navigate('/provider-dashboard'); // Navigate to the provider dashboard
    };

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">Error loading CVs!</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-6"
                onClick={handleNavigate}
            >
                Go to Provider Dashboard
            </button>
            {cvs.length === 0 ? (
                <p className="text-center text-gray-700">No CVs found for this provider.</p>
            ) : (
                <div className="space-y-6">
                    {cvs.map(cv => (
                        <div key={cv.curriculum_vitae_id} className="bg-white shadow-lg rounded-lg p-6 relative">
                            <h2 className="text-xl font-bold mb-2">{cv.seeker.first_name} {cv.seeker.last_name}</h2>
                            <p className="text-gray-700 mb-2"><strong>Email:</strong> {cv.seeker.email}</p>
                            <p className="text-gray-700 mb-4"><strong>Phone:</strong> {cv.seeker.phonenumber}</p>

                            <h3 className="text-lg font-semibold mb-2">Skills:</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {cv.skills.map((skill, index) => (
                                    <span key={index} className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-lg font-semibold mb-2">Education:</h3>
                            {cv.educations.map(education => (
                                <div key={education.id} className="mb-4">
                                    <p className="text-gray-600"><strong>Institution:</strong> {education.institution}</p>
                                    <p className="text-gray-600"><strong>Degree:</strong> {education.degree}</p>
                                    <p className="text-gray-600"><strong>Field of Study:</strong> {education.field_of_study}</p>
                                    <p className="text-gray-600"><strong>Duration:</strong> {education.start_date} to {education.end_date}</p>
                                </div>
                            ))}

                            <h3 className="text-lg font-semibold mb-2">Job Experience:</h3>
                            {cv.job_experiences.map(job => (
                                <div key={job.id} className="mb-4">
                                    <p className="text-gray-600"><strong>Company:</strong> {job.company_name}</p>
                                    <p className="text-gray-600"><strong>Position:</strong> {job.position}</p>
                                    <p className="text-gray-600"><strong>Description:</strong> {job.description}</p>
                                    <p className="text-gray-600"><strong>Duration:</strong> {job.start_date} to {job.end_date ? job.end_date : 'Present'}</p>
                                </div>
                            ))}

                            <button
                                className="absolute bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                                onClick={() => handleUnsave(cv.curriculum_vitae_id, cv.seeker.id)}
                            >
                                Unsave
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedCV;
