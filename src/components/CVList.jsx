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

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Curriculum Vitae</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : cvs.length > 0 ? (
                    <div>
                        {cvs.map(cv => (
                            <div key={cv.id}
                                 className="border border-gray-200 rounded-lg p-4 hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">CV ID: {cv.id}</p>
                                <p className="text-gray-700">Created
                                    At: {new Date(cv.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-700">Updated
                                    At: {new Date(cv.updated_at).toLocaleDateString()}</p>

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
                                            <li key={job.id} className="text-gray-700 list-none">
                                                {job.position} <br/> {job.company_name}
                                                <p className='text-gray-700'> From {new Date(job.start_date).toLocaleDateString()} To {new Date(job.end_date).toLocaleDateString()}
                                                </p>
                                                <br/> {job.description}


                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-4">
                                    <h2 className="text-xl font-semibold">Education</h2>
                                    <ul className="list-disc list-inside">
                                        {cv.educations.map(education => (
                                            <li key={education.id} className="text-gray-700">
                                                {education.degree} from {education.institution} ({new Date(education.start_date).toLocaleDateString()} - {new Date(education.end_date).toLocaleDateString()})
                                            </li>
                                        ))}
                                    </ul>
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
