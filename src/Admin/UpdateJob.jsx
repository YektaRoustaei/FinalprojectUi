import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';


const UpdateJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("full-time");
    const [expiryDate, setExpiryDate] = useState("");
    const [coverLetter, setCoverLetter] = useState(true);
    const [question, setQuestion] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [jobskills, setJobskills] = useState([]);
    const [allJobskills, setAllJobskills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch categories and skills
        Promise.all([
            fetch('http://127.0.0.1:8000/api/categories').then(response => response.json()),
            fetch('http://127.0.0.1:8000/api/skills').then(response => response.json())
        ])
            .then(([categoriesData, skillsData]) => {
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

        if (id) {
            axios.get(`http://127.0.0.1:8000/api/job/${id}`)
                .then(response => {
                    const job = response.data;
                    setTitle(job.title);
                    setDescription(job.description);
                    setSalary(job.salary);
                    setType(job.type);
                    setExpiryDate(job.expiry_date || "");
                    setCoverLetter(job.cover_letter === 1);
                    setQuestion(job.question === 1);

                    if (job.provider && job.provider.city) {
                        setSelectedCategories([{
                            value: job.provider.city.id,
                            label: job.provider.city.city_name
                        }]); // Assuming provider city as a category
                    }

                    if (job.jobskills) {
                        setJobskills(job.jobskills.map(skill => ({
                            value: skill.id,
                            label: skill.name
                        })));
                    }
                })
                .catch(error => {
                    console.error('Error fetching job details:', error);
                    toast.error('Error fetching job details');
                });
        }
    }, [id]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions || []);
    };

    const handleJobskillChange = (newValue) => {
        setJobskills(newValue || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedJobPosting = {
            title,
            description,
            salary: salary.toString(),  // Convert salary to string
            type,
            expiry_date: expiryDate,
            cover_letter: coverLetter ? 1 : 0, // Convert boolean to integer
            question: question ? 1 : 0, // Convert boolean to integer
            category_ids: selectedCategories.map(option => option.value),
            jobskills: jobskills.map(option => option.value.toString()) // Convert skill IDs to string
        };

        try {
            setIsLoading(true);
            const response = await axios.put(`http://127.0.0.1:8000/api/updatejob/${id}`, updatedJobPosting, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success("Job updated successfully");
                navigate('/admin'); // Navigate to /provider-dashboard/jobs after successful update
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
        navigate('/admin'); // Navigate to /provider-dashboard/jobs on cancel
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Update Job Posting</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Form Fields */}
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
                            type="number"
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
                        <label htmlFor="expiry_date" className="block text-gray-700 font-bold mb-2">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            id="expiry_date"
                            name="expiry_date"
                            className="border rounded w-full py-2 px-3"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="cover_letter" className="block text-gray-700 font-bold mb-2">
                            Cover Letter Required
                        </label>
                        <select
                            id="cover_letter"
                            name="cover_letter"
                            className="border rounded w-full py-2 px-3"
                            value={coverLetter ? '1' : '0'}
                            onChange={(e) => setCoverLetter(e.target.value === '1')}
                        >
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="question" className="block text-gray-700 font-bold mb-2">
                            Questionnaire Required
                        </label>
                        <select
                            id="question"
                            name="question"
                            className="border rounded w-full py-2 px-3"
                            value={question ? '1' : '0'}
                            onChange={(e) => setQuestion(e.target.value === '1')}
                        >
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                            Categories
                        </label>
                        <CreatableSelect
                            isMulti
                            options={categories}
                            value={selectedCategories}
                            onChange={handleCategoryChange}
                            placeholder="Select categories"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="skills" className="block text-gray-700 font-bold mb-2">
                            Job Skills
                        </label>
                        <CreatableSelect
                            isMulti
                            options={allJobskills}
                            value={jobskills}
                            onChange={handleJobskillChange}
                            placeholder="Select job skills"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Updating...' : 'Update Job'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 text-white py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateJob;
