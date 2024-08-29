import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CVList = () => {
    const [cvs, setCVs] = useState([]);
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
                    const cvData = response.data.curriculum_vitae;
                    setCVs(cvData);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching CVs:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginseeker');
        }
    }, [navigate]);

    const handleEdit = (cvId) => {
        navigate(`/seeker-dashboard/editcv/${cvId}`);
    };

    const handleDelete = (cvId) => {
        const token = localStorage.getItem('Seeker_token');
        if (token) {
            axios.delete('http://127.0.0.1:8000/api/seeker/cv/delete', {
                data: { id: cvId },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    setCVs(cvs.filter(cv => cv.id !== cvId));
                })
                .catch(error => {
                    console.error('Error deleting CV:', error.response ? error.response.data : error.message);
                });
        }
    };

    const handleCreate = () => {
        navigate('/seeker/cv');
    };

    const formatDate = (date) => {
        if (date === 'until now') {
            return date;
        }
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-semibold mb-8 text-gray-800">My CVs</h1>
                <button
                    onClick={handleCreate}
                    className="mb-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-300 shadow-md"
                >
                    Create New CV
                </button>
                {loading ? (
                    <div className="text-gray-500">Loading...</div>
                ) : cvs.length > 0 ? (
                    <div>
                        {cvs.map(cv => (
                            <div key={cv.id}
                                 className="relative border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md mb-6 transition duration-300">
                                <p className="text-xl font-semibold mb-4 text-gray-700">CV ID: {cv.id}</p>
                                <p className="text-gray-500 mb-2">Created: {new Date(cv.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-500 mb-4">Last Updated: {new Date(cv.updated_at).toLocaleDateString()}</p>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Skills</h2>
                                    <div className="flex flex-wrap">
                                        {cv.seeker_skills.map(seekerSkill => (
                                            <span
                                                key={seekerSkill.id}
                                                className="text-sm text-gray-800 bg-gray-200 rounded-full px-4 py-2 font-medium mr-2 mb-2 shadow-sm"
                                            >
                                                {seekerSkill.skill.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Job Experiences</h2>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {cv.job_experiences.map(job => (
                                            <li key={job.id} className="mb-4 list-none">
                                                <p className="font-semibold">{job.position} at {job.company_name}</p>
                                                <p>From {formatDate(job.start_date)} To {formatDate(job.end_date)}</p>
                                                <p className="mt-2 text-gray-600">{job.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Education</h2>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {cv.educations.map(education => (
                                            <li key={education.id} className="mb-4 list-none">
                                                <p className="font-semibold">{education.degree} from {education.institution}</p>
                                                <p>({formatDate(education.start_date)} - {formatDate(education.end_date)})</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="absolute bottom-4 right-4 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(cv.id)}
                                        className="px-4 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition duration-300 shadow-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cv.id)}
                                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500">No CVs available.</div>
                )}
                <button
                    onClick={() => navigate('/seeker-dashboard')}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300 shadow-md"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default CVList;
