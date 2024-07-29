import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

const UpdateJobPosting = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("full-time");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [jobskills, setJobskills] = useState([]);
    const [allJobskills, setAllJobskills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch categories and skills
        Promise.all([
            fetch('http://127.0.0.1:8000/api/categories').then(response => response.json()),
            fetch('http://127.0.0.1:8000/api/skills').then(response => response.json()),
        ])
            .then(([categoriesData, skillsData]) => {
                // Format and set categories and job skills
                const formattedCategories = categoriesData.map(category => ({
                    value: category.id,
                    label: category.title
                }));
                setCategories(formattedCategories);

                const formattedJobskills = skillsData.map(skill => ({
                    value: skill.id,
                    label: skill.name
                }));
                setAllJobskills(formattedJobskills);
            })
            .catch(error => console.error('Error fetching categories or skills:', error));

        // Fetch job details
        const token = localStorage.getItem('Provider_token');
        axios.get(`http://127.0.0.1:8000/api/job/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                const job = response.data;
                setTitle(job.title);
                setDescription(job.description);
                setSalary(job.salary);
                setType(job.type);

                if (job.categories) {
                    setSelectedCategories(job.categories.map(cat => ({
                        value: cat.id,
                        label: cat.title
                    })));
                }

                if (job.jobskills) {
                    setJobskills(job.jobskills.map(skill => ({
                        value: skill.skill.id,
                        label: skill.skill.name
                    })));
                }
            })
            .catch(error => console.error('Error fetching job details:', error));
    }, [id]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions || []);
    };

    const handleJobskillChange = (newValue) => {
        setJobskills(newValue || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure salary is a string
        const updatedJobPosting = {
            title,
            description,
            salary: salary.toString(),  // Convert salary to string
            type,
            category_ids: selectedCategories.map(option => option.value),
            jobskills: jobskills.map(option => option.value.toString()) // Convert skill IDs to string
        };

        try {
            setIsLoading(true);
            const token = localStorage.getItem('Provider_token');
            const response = await axios.put(`http://127.0.0.1:8000/api/updatejob/${id}`, updatedJobPosting, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Job updated successfully");
                navigate('/seeker-dashboard'); // Navigate to /seeker-dashboard after successful update
            } else {
                toast.error('Job update failed. Please try again.');
            }
        } catch (err) {
            console.error('Error updating job:', err);
            toast.error('Job update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/provider-dashboard/jobs'); // Navigate to /provider-dashboard/jobs on cancel
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Update Job Posting</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                            Job Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Job Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                            Job Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Job Description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salary" className="block text-gray-700 font-bold mb-2">
                            Salary per month
                        </label>
                        <input
                            type="text"
                            id="salary"
                            name="salary"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Salary"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                            Job Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="border rounded w-full py-2 px-3"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="full-time">Full-Time</option>
                            <option value="part-time">Part-Time</option>
                            <option value="contract">Contract</option>
                            <option value="remote">Remote</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                            Category
                        </label>
                        <CreatableSelect
                            id="category"
                            name="category"
                            options={categories}
                            onChange={handleCategoryChange}
                            isMulti
                            className="border rounded w-full py-2 px-3"
                            placeholder="Select categories"
                            value={selectedCategories}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobskills" className="block text-gray-700 font-bold mb-2">
                            Job Skills
                        </label>
                        <CreatableSelect
                            id="jobskills"
                            options={allJobskills}
                            onChange={handleJobskillChange}
                            isMulti
                            className="border rounded w-full py-2 px-3"
                            placeholder="Type or select job skills"
                            value={jobskills}
                        />
                    </div>
                    <div className="flex justify-between">

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 m-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 m-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Job'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateJobPosting;
