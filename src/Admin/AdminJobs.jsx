import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [latestJobs, setLatestJobs] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    const [allJobs, setAllJobs] = useState([]);

    const fetchJobs = (search = '') => {
        fetch(`http://127.0.0.1:8000/api/joblist?search_term=${encodeURIComponent(search)}`)
            .then(response => response.json())
            .then(data => {
                setJobs(data);
                if (search === '') {
                    setLatestJobs(data.slice(0, 5)); // Set latest jobs
                }
                setAllJobs(data); // Keep all jobs for search
            })
            .catch(error => {
                console.error('There was an error fetching the jobs!', error);
            });
    };

    // Fetch city data
    const fetchCitiesData = () => {
        fetch('http://127.0.0.1:8000/api/city/static')
            .then(response => response.json())
            .then(data => {
                const citiesArray = Object.values(data).map(city => ({
                    name: city.city_name,
                    jobPostingsCount: city.job_postings_count
                }));
                setCitiesData(citiesArray);
            })
            .catch(error => {
                console.error('There was an error fetching the cities data!', error);
            });
    };

    useEffect(() => {
        fetchJobs(); // Fetch all jobs initially
        fetchCitiesData(); // Fetch city data initially
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchJobs(searchTerm); // Fetch jobs based on search term
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchJobs(''); // Fetch all jobs again with an empty search term
    };

    const toggleDetails = (jobId) => {
        setExpandedJob(expandedJob === jobId ? null : jobId);
    };

    const handleEdit = (jobId) => {
        console.log(`Edit job with ID: ${jobId}`);
    };

    const handleDelete = (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            console.log(`Delete job with ID: ${jobId}`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        }
    };

    const getCitiesChartData = () => {
        const labels = citiesData.map(city => city.name);
        const data = citiesData.map(city => city.jobPostingsCount);

        return {
            labels,
            datasets: [{
                label: 'Job Postings',
                data,
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 1,
            }]
        };
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Jobs</h1>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="px-4 py-2 text-gray-600 border-none cursor-pointer hover:text-gray-900 transition-colors duration-300"
                        >
                            &times; {/* Clear icon (×) */}
                        </button>
                    )}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by job title or company"
                        className="flex-1 p-2 border-none outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white border-none cursor-pointer hover:bg-blue-700 transition-colors duration-300"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Bar Chart for Job Postings by City */}
            <div className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                <h3 className="text-lg font-semibold mb-2">Job Postings by City</h3>
                {citiesData.length === 0 ? (
                    <p className="text-gray-600">No data available</p>
                ) : (
                    <Bar
                        data={getCitiesChartData()}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (tooltipItem) {
                                            return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'City'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Job Postings Count'
                                    },
                                    beginAtZero: true
                                }
                            }
                        }}
                    />
                )}
            </div>

            {/* Displaying Latest Jobs or Search Results */}
            {(searchTerm === '' ? latestJobs : jobs).map(job => (
                <div key={job.id} className="relative bg-white border border-gray-200 rounded-lg shadow-lg mb-6 p-6">
                    <div className='grid grid-cols-2 gap-6 mb-10'>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600"><strong>Provider:</strong> {job.provider.company_name}</p>
                            <p className="text-gray-600"><strong>Type:</strong> {job.type}</p>
                            <p className="text-gray-600"><strong>Salary:</strong> ${job.salary}</p>
                            {/* Removed skills part */}
                        </div>

                        {/* Pie chart for skills (currently empty) */}
                        <div className="flex flex-col mb-10">
                            <div className="h-36">
                                {/* Pie chart can be added here if needed */}
                            </div>
                        </div>
                    </div>

                    {expandedJob === job.id && (
                        <div className="mt-4">
                            <div className="mb-6">
                                <p className="text-gray-600"><strong>Description:</strong> {job.description}</p>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Provider Details</h3>
                                <p className="text-gray-600"><strong>Company:</strong> {job.provider.company_name}</p>
                                <p className="text-gray-600"><strong>Email:</strong> {job.provider.email}</p>
                                <p className="text-gray-600"><strong>Telephone:</strong> {job.provider.telephone}</p>
                                <p className="text-gray-600"><strong>Description:</strong> {job.provider.description}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Categories</h3>
                                {/* Removed categories part as it's not present in the data */}
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => handleEdit(job.id)}
                            className="px-4 py-2 border border-green-600 hover:bg-green-700 hover:text-white rounded transition-colors duration-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(job.id)}
                            className="px-4 py-2 border border-red-600 hover:text-white hover:bg-red-700 rounded transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </div>

                    <button
                        onClick={() => toggleDetails(job.id)}
                        className={`absolute bottom-4 right-4 px-4 py-2 text-white font-semibold rounded ${expandedJob === job.id ? 'bg-blue-600' : 'bg-blue-500'} transition-colors duration-300`}
                    >
                        {expandedJob === job.id ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AdminJobs;
