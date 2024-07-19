import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CV = () => {
    const navigate = useNavigate();

    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [educations, setEducations] = useState([{ degree: '', institution: '', field_of_study: '', start_date: '', end_date: '' }]);
    const [jobExperiences, setJobExperiences] = useState([{ position: '', company_name: '', start_date: '', end_date: '', description: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = () => {
        axios.get('http://127.0.0.1:8000/api/skills')
            .then(response => {
                const formattedSkills = response.data.map(skill => ({
                    value: skill.id,
                    label: skill.name
                }));
                setSkills(formattedSkills);
            })
            .catch(error => {
                console.error('There was an error fetching the skills!', error);
            });
    };

    const handleSkillChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions);
    };

    const handleNewSkillChange = (e) => {
        setNewSkill(e.target.value);
    };

    const handleAddNewSkill = () => {
        if (newSkill.trim() !== '') {
            const newSkillObject = { label: newSkill, value: null }; // value is null for new skills
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

        const newCV = {
            skills: selectedSkills.map(option => ({
                id: option.value,
                name: option.label
            })),
            educations,
            job_experiences: jobExperiences
        };

        try {
            setIsLoading(true);
            const token = localStorage.getItem('Seeker_token');
            const response = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/seeker/cv/create',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                data: JSON.stringify(newCV),
            });

            if (response.status === 201) {
                toast.success("CV created successfully");
                navigate('/seeker-dashboard');
            } else {
                toast.error('CV creation failed. Please try again.');
            }

        } catch (err) {
            console.error('Some error occurred during CV creation: ', err);
            if (err.response) {
                console.error('Error response:', err.response.data);
            }
            toast.error('CV creation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Create Your CV</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4 grid grid-cols-1 ">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Skills</label>
                            <Select
                                value={selectedSkills}
                                onChange={handleSkillChange}
                                options={skills}
                                isMulti
                                className="border rounded w-full py-2 px-3 mb-2"
                            />
                        </div>

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
                                <input
                                    type="date"
                                    name="end_date"
                                    value={jobExperience.end_date}
                                    onChange={event => handleChange(index, event, jobExperiences, setJobExperiences)}
                                    placeholder="End Date"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                />
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
                        <button type="button" onClick={() => handleAdd(jobExperiences, setJobExperiences, { position: '', company_name: '', start_date: '', end_date: '', description: '' })} className="text-blue-500">Add Job Experience</button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2">Education</label>
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
                                    name="field_of_study"
                                    value={education.field_of_study}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="Field of Study"
                                    className="border rounded w-full py-2 px-3 mb-2"
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
                                <input
                                    type="date"
                                    name="end_date"
                                    value={education.end_date}
                                    onChange={event => handleChange(index, event, educations, setEducations)}
                                    placeholder="End Date"
                                    className="border rounded w-full py-2 px-3 mb-2"
                                />
                                <button type="button" onClick={() => handleRemove(index, educations, setEducations)}
                                        className="text-red-500">Remove
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={() => handleAdd(educations, setEducations, {
                            degree: '',
                            institution: '',
                            start_date: '',
                            end_date: ''
                        })} className="text-blue-500">Add Education
                        </button>
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                            disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create CV'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default CV;
