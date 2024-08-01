import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

const EditCv = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [educations, setEducations] = useState([]);
    const [jobExperiences, setJobExperiences] = useState([]);
    const [cvData, setCvData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCvId, setSelectedCvId] = useState(null);
    const token = localStorage.getItem('Seeker_token');

    useEffect(() => {
        fetchSkills();
        fetchCvData();
    }, [id]);

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/skills');
            const formattedSkills = response.data.map(skill => ({
                value: skill.id,
                label: skill.name
            }));
            setSkills(formattedSkills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            toast.error('Failed to load skills.');
        }
    };

    const fetchCvData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/seeker/get-info', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const cvArray = response.data.curriculum_vitae;

            if (cvArray.length > 0) {
                const cv = cvArray.find(cv => cv.id === parseInt(id));
                if (cv) {
                    const formattedSkills = cv.seeker_skills.map(skill => ({
                        value: skill.skill.id,
                        label: skill.skill.name
                    }));

                    setSelectedSkills(formattedSkills);
                    setEducations(cv.educations.map(ed => ({
                        id: ed.id,
                        ...ed,
                        until_now: ed.end_date === '' || ed.end_date === 'until now'
                    })));
                    setJobExperiences(cv.jobExperiences.map(job => ({
                        id: job.id,
                        ...job,
                        until_now: job.end_date === '' || job.end_date === 'until now'
                    })));
                    setCvData(cv);
                    setSelectedCvId(cv.id);
                } else {
                    throw new Error('CV not found.');
                }
            } else {
                throw new Error('No CVs available.');
            }
        } catch (error) {
            console.error('Error fetching CV data:', error);
            toast.error(`Failed to load CV data: ${error.message}`);
        }
    };

    const handleSkillChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions || []);
    };

    const handleNewSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const handleAddNewSkill = () => {
        if (newSkill.trim() !== '') {
            const newSkillObject = { label: newSkill, value: null };
            setSkills([...skills, newSkillObject]);
            setSelectedSkills([...selectedSkills, newSkillObject]);
            setNewSkill('');
        }
    };

    const handleChange = (index, event, state, setState) => {
        const values = [...state];
        values[index][event.target.name] = event.target.value;
        setState(values);
    };

    const handleCheckboxChange = (index, event, state, setState) => {
        const values = [...state];
        const isChecked = event.target.checked;
        values[index].until_now = isChecked;
        values[index].end_date = isChecked ? null : values[index].end_date; // Set end_date to null if checked
        setState(values);
    };

    const handleAdd = (state, setState, newEntry) => {
        setState([...state, newEntry]);
    };

    const handleRemove = (index, state, setState) => {
        const values = [...state];
        values.splice(index, 1);
        setState(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedCV = {
            cv_id: selectedCvId,
            skills: selectedSkills.map(option => ({
                id: option.value,
                name: option.label
            })),
            educations: educations.map(education => ({
                id: education.id,
                degree: education.degree,
                institution: education.institution,
                field_of_study: education.field_of_study,
                start_date: education.start_date,
                end_date: education.until_now ? null : education.end_date
            })),
            job_experiences: jobExperiences.map(jobExperience => ({
                id: jobExperience.id,
                position: jobExperience.position,
                company_name: jobExperience.company_name,
                start_date: jobExperience.start_date,
                end_date: jobExperience.until_now ? null : jobExperience.end_date,
                description: jobExperience.description
            }))
        };

        try {
            setIsLoading(true);
            const response = await axios.put(`http://127.0.0.1:8000/api/seeker/cv/update`, updatedCV, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success("CV updated successfully");
                navigate('/seeker-dashboard');
            } else {
                toast.error('CV update failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during CV update:', err);
            toast.error('CV update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Edit Your CV</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Skills</label>
                        <Select
                            value={selectedSkills}
                            onChange={handleSkillChange}
                            options={skills}
                            isMulti
                            className="border rounded w-full py-2 px-3 mb-2"
                        />
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={handleNewSkillChange}
                                placeholder="Enter New Skill"
                                className="border rounded w-10/12 py-2 px-3"
                            />
                            <button type="button" onClick={handleAddNewSkill} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Add Skill</button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Job Experiences</label>
                        {jobExperiences.map((jobExperience, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    name="position"
                                    value={jobExperience.position}
                                    onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                    placeholder="Position"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="company_name"
                                    value={jobExperience.company_name}
                                    onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                    placeholder="Company Name"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    required
                                />
                                <input
                                    type="date"
                                    name="start_date"
                                    value={jobExperience.start_date}
                                    onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                    placeholder="Start Date"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                />
                                <div className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={jobExperience.until_now}
                                        onChange={event => handleCheckboxChange(index, event, jobExperiences, setJobExperiences)}
                                        className="mr-2"
                                    />
                                    <label>Until Now</label>
                                </div>
                                {!jobExperience.until_now && (
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={jobExperience.end_date}
                                        onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                        placeholder="End Date"
                                        className="border rounded w-full py-2 px-3 mb-2"
                                    />
                                )}
                                <textarea
                                    name="description"
                                    value={jobExperience.description}
                                    onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                    placeholder="Job Description"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                ></textarea>
                                <button type="button" onClick={() => handleRemove(index, jobExperiences, setJobExperiences)} className="text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAdd(jobExperiences, setJobExperiences, { id: null, position: '', company_name: '', start_date: '', end_date: '', description: '', until_now: false })} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Job Experience</button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Educations</label>
                        {educations.map((education, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    name="degree"
                                    value={education.degree}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="Degree"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    required
                                />
                                <input
                                    type="text"
                                    name="institution"
                                    value={education.institution}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="Institution"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                    required
                                />
                                <input
                                    type="date"
                                    name="start_date"
                                    value={education.start_date}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="Start Date"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                />
                                <div className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={education.until_now}
                                        onChange={event => handleCheckboxChange(index, event, educations, setEducations)}
                                        className="mr-2"
                                    />
                                    <label>Until Now</label>
                                </div>
                                {!education.until_now && (
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={education.end_date}
                                        onChange={event => handleChange(index, event, educations, setEducations)}
                                        placeholder="End Date"
                                        className="border rounded w-full py-2 px-3 mb-2"
                                    />
                                )}
                                <textarea
                                    name="description"
                                    value={education.description}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="Education Description"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                ></textarea>
                                <button type="button" onClick={() => handleRemove(index, educations, setEducations)} className="text-red-500">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAdd(educations, setEducations, { id: null, degree: '', institution: '', start_date: '', end_date: '', description: '', until_now: false })} className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Add Education</button>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Updating...' : 'Update CV'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditCv;
