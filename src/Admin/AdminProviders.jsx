import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const AdminProviders = () => {
    const [providers, setProviders] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const [showDetails, setShowDetails] = useState({}); // Track which provider's details are visible
    const [expandedJob, setExpandedJob] = useState({}); // Track which job's description is expanded

    // Fetch providers based on the search term
    const fetchProviders = (search = '') => {
        fetch(`http://127.0.0.1:8000/api/provider/all?search=${encodeURIComponent(search)}`)
            .then(response => response.json())
            .then(data => {
                setProviders(data.providers);
            })
            .catch(error => {
                console.error('There was an error fetching the providers!', error);
            });
    };

    useEffect(() => {
        fetchProviders(); // Fetch all providers initially
    }, []);

    // Handle search submit
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProviders(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchProviders(''); // Fetch all providers again with an empty search term
    };

    const toggleDetails = (id) => {
        setShowDetails(prevDetails => ({
            ...prevDetails,
            [id]: !prevDetails[id] // Toggle visibility of details
        }));
    };

    const toggleJobDescription = (jobId) => {
        setExpandedJob(prevExpanded => ({
            ...prevExpanded,
            [jobId]: !prevExpanded[jobId] // Toggle visibility of job description
        }));
    };

    const handleEdit = (providerId) => {
        // Logic for editing provider (e.g., redirect to edit page or show a modal)
        console.log(`Edit provider with ID: ${providerId}`);
    };

    const handleDelete = (providerId) => {
        if (window.confirm('Are you sure you want to delete this provider?')) {
            // Logic for deleting provider (e.g., send DELETE request to API)
            console.log(`Delete provider with ID: ${providerId}`);
            // For demonstration, remove provider from state
            setProviders(prevProviders => prevProviders.filter(provider => provider.id !== providerId));
        }
    };

    // Function to generate chart data
    const getChartData = (jobStatuses) => {
        const { hold, accepted, rejected } = jobStatuses;

        return {
            labels: ['Hold', 'Accepted', 'Rejected'],
            datasets: [{
                data: [hold, accepted, rejected],
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 1,
            }]
        };
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Providers</h1>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-6">
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
                        placeholder="Search by company name or address"
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

            {providers.map(provider => {
                const { hold, accepted, rejected } = provider.job_statuses;
                const total = hold + accepted + rejected;

                return (
                    <div key={provider.id} className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                        <div className='grid grid-cols-2 gap-6 mb-10'>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-900">{provider.company_name}</h2>
                                <p><strong className="font-medium">Address:</strong> {provider.address}</p>
                                <p><strong className="font-medium">Telephone:</strong> {provider.telephone}</p>
                                <p><strong className="font-medium">Email:</strong> {provider.email}</p>
                                <p><strong className="font-medium">Job Count:</strong> {provider.job_count}</p>
                            </div>

                            {/* Pie chart */}
                            <div className="flex flex-col ">
                                <div className="h-36">
                                    <h3 className="text-lg font-semibold mb-2 ">Acceptance Status</h3>
                                    {total === 0 ? (
                                        <p className=" text-gray-600">No one has applied for this job</p>
                                    ) : (
                                        <>
                                            <Pie
                                                data={getChartData(provider.job_statuses)}
                                                options={{
                                                    responsive: true,
                                                    plugins: {
                                                        legend: {
                                                            position: 'top',
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: function (tooltipItem) {
                                                                    const dataset = tooltipItem.dataset;
                                                                    const total = dataset.data.reduce((acc, value) => acc + value, 0);
                                                                    const value = dataset.data[tooltipItem.dataIndex];
                                                                    const percentage = ((value / total) * 100).toFixed(2);
                                                                    return `${dataset.label}: ${value} (${percentage}%)`;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }}
                                            />
                                            <p className="mt-2  text-gray-600">Total Applications: {total}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {showDetails[provider.id] && (
                            <div className="mt-4">
                                <p><strong className="font-medium">Description:</strong> {provider.description}</p>
                                <div className="bg-blue-700 text-white p-3 rounded mt-4">
                                    <h3 className="font-extrabold text-center text-lg">Jobs</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {provider.jobs.map(job => (
                                        <div key={job.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4 flex-1 min-w-[calc(33.333%_-_1rem)] max-w-[calc(33.333%_-_1rem)] hover:shadow-lg transition-shadow duration-300">
                                            <h4 className="text-lg font-semibold mb-2 text-gray-800">{job.title}</h4>
                                            <p className="text-gray-700">
                                                <strong>Description:</strong>
                                                {expandedJob[job.id] ? job.description : `${job.description.substring(0, 100)}...`}
                                            </p>
                                            <button
                                                onClick={() => toggleJobDescription(job.id)}
                                                className="text-blue-600 mt-2 underline"
                                            >
                                                {expandedJob[job.id] ? 'Read Less' : 'Read More'}
                                            </button>
                                            <p className="mt-2 text-gray-600"><strong>Salary:</strong> ${job.salary}</p>
                                            <p className="text-gray-600"><strong>Type:</strong> {job.type}</p>
                                            <p className="text-gray-600"><strong>Skills:</strong> {job.skills.join(', ')}</p>
                                            <p className="text-gray-600"><strong>Categories:</strong> {job.categories.join(', ')}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Edit and Delete Buttons */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                            <button
                                onClick={() => handleEdit(provider.id)}
                                className="px-4 py-2 border border-green-600 hover:bg-green-700 hover:text-white rounded transition-colors duration-300"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(provider.id)}
                                className="px-4 py-2  border border-red-600 hover:text-white  hover:bg-red-700 rounded transition-colors duration-300"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Toggle Details Button */}
                        <button
                            onClick={() => toggleDetails(provider.id)}
                            className={`absolute bottom-4 right-4 px-4 py-2 text-white font-semibold rounded ${showDetails[provider.id] ? 'bg-blue-600' : 'bg-blue-500'} transition-colors duration-300`}
                        >
                            {showDetails[provider.id] ? 'Hide Details' : 'Show Details'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AdminProviders;
