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
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Curriculum Vitae</h1>
                <button
                    onClick={handleCreate}
                    className="mb-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
                >
                    Create New CV
                </button>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : cvs.length > 0 ? (
                    <div>
                        {cvs.map(cv => (
                            <div key={cv.id}
                                 className="relative border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">CV ID: {cv.id}</p>
                                <p className="text-gray-700">Created At: {new Date(cv.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-700">Updated At: {new Date(cv.updated_at).toLocaleDateString()}</p>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">Skills</h2>
                                    <ul className="list-disc list-inside">
                                        {cv.seeker_skills.map(seekerSkill => (
                                            <li key={seekerSkill.id} className="text-gray-700">
                                                {seekerSkill.skill.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">Job Experiences</h2>
                                    <ul className="list-disc list-inside">
                                        {cv.job_experiences.map(job => (
                                            <li key={job.id} className="text-gray-700">
                                                {job.position} <br /> {job.company_name}
                                                <p className='text-gray-700'>From {formatDate(job.start_date)} To {formatDate(job.end_date)}</p>
                                                <br /> {job.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">Education</h2>
                                    <ul className="list-disc list-inside">
                                        {cv.educations.map(education => (
                                            <li key={education.id} className="text-gray-700">
                                                {education.degree} from {education.institution} ({formatDate(education.start_date)} - {formatDate(education.end_date)})
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="absolute bottom-4 right-4 flex space-x-4">
                                    <button
                                        onClick={() => handleEdit(cv.id)}
                                        className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600 transition duration-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cv.id)}
                                        className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">No CVs available.</div>
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

export default CVList;
