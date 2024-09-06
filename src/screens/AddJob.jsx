import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Import Select instead of CreatableSelect
import CreatableSelect from 'react-select/creatable';

const AddJobPosting = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("full-time");
    const [expiryDate, setExpiryDate] = useState("");
    const [coverLetter, setCoverLetter] = useState(true);
    const [questionRequired, setQuestionRequired] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [jobskills, setJobskills] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allJobskills, setAllJobskills] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/categories')
            .then(response => response.json())
            .then(data => {
                const formattedCategories = data.map(category => ({
                    value: category.id,
                    label: category.title
                }));
                setCategories(formattedCategories);
            })
            .catch(error => console.error('Error fetching categories:', error));

        fetch('http://127.0.0.1:8000/api/skills')
            .then(response => response.json())
            .then(data => {
                const formattedJobskills = data.map(skill => ({
                    value: skill.id,
                    label: skill.name
                }));
                setAllJobskills(formattedJobskills);
            })
            .catch(error => console.error('Error fetching job skills:', error));
    }, []);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions ? selectedOptions.map(option => option.value) : []);
    };

    const handleJobskillChange = (newValue) => {
        setJobskills(newValue ? newValue.map(option => option.label) : []);
    };

    const validateForm = () => {
        if (!title || !description || !salary || !type) {
            toast.error('Please fill out all required fields.');
            return false;
        }

        if (expiryDate) {
            const expiry = new Date(expiryDate);
            if (expiry < new Date()) {
                toast.error('Expiry date must be in the future.');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const newJobPosting = {
            title,
            description,
            salary,
            type,
            expiry_date: expiryDate || null,  // Handle optional expiry date
            cover_letter: coverLetter,
            question: questionRequired,
            category_ids: selectedCategories,
            jobskills
        };

        try {
            setIsLoading(true);
            const token = localStorage.getItem('Provider_token');
            const response = await axios.post('http://127.0.0.1:8000/api/provider/jobs/create', newJobPosting, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 201) {
                toast.success("Job posting created successfully");
                const newJobId = response.data.job_id; // Adjust according to the actual response structure
                if (questionRequired) {
                    navigate(`/add-question?job-id=${newJobId}`);
                } else {
                    navigate('/provider-dashboard');
                }
            } else {
                toast.error('An unexpected error occurred.');
            }
        } catch (err) {
            console.error('Error creating job posting:', err);
            toast.error('Job posting creation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Add Job Posting</h2>
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
                            value={coverLetter.toString()}
                            onChange={(e) => setCoverLetter(e.target.value === 'true')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
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
                            value={questionRequired.toString()}
                            onChange={(e) => setQuestionRequired(e.target.value === 'true')}
                        >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                            Category
                        </label>
                        <Select
                            id="category"
                            name="category"
                            isMulti
                            options={categories}
                            onChange={handleCategoryChange}
                            placeholder="Select categories"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobskills" className="block text-gray-700 font-bold mb-2">
                            Job Skills
                        </label>
                        <CreatableSelect
                            id="jobskills"
                            name="jobskills"
                            isMulti
                            options={allJobskills}
                            onChange={handleJobskillChange}
                            placeholder="Select or create job skills"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 rounded ${isLoading ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Add Job Posting'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddJobPosting;
