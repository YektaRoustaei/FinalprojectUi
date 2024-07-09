import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const AddJobPosting = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [salary, setSalary] = useState("");
    const [type, setType] = useState("full-time"); // Default value set to 'full-time'
    const [location, setLocation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newJobPosting = {
            title,
            description,
            salary,
            type,
            location
        };

        try {
            setIsLoading(true);
            const response = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/provider/jobs/create',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(newJobPosting),
            });
            console.log('Response data:', response.data);

            if (response.status === 200 && response.data && response.data.id) {
                toast.success("Job posting created successfully");
                navigate('/job-postings');
            } else {
                console.log('Unexpected response format:', response.data); // Debugging log
                toast.error('Job posting creation failed. Please try again.');
            }

        } catch (err) {
            console.log('Some error occurred during job posting creation: ', err);

            if (err.response) {
                console.error('Error response:', err.response.data); // Detailed error response
            }
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
                            Salary per mounth
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
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}

                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Add Job
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AddJobPosting;
