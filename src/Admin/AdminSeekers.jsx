import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const AdminSeekers = () => {
    const [seekers, setSeekers] = useState([]);
    const [citiesData, setCitiesData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSeeker, setExpandedSeeker] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true); // New state to track initial load


    const fetchSeekers = (search = '') => {
        fetch(`http://127.0.0.1:8000/api/seeker/all?search=${encodeURIComponent(search)}`)
            .then(response => response.json())
            .then(data => {
                setSeekers(data);
                setInitialLoad(false);  // Set initial load to false after the first fetch
            })
            .catch(error => {
                console.error('There was an error fetching the seekers!', error);
            });
    };

    // Fetch city data
    const fetchCitiesData = () => {
        fetch('http://127.0.0.1:8000/api/city/static')
            .then(response => response.json())
            .then(data => {
                const citiesArray = Object.values(data).map(city => ({
                    name: city.city_name,
                    seekersCount: city.seekers_count
                }));
                setCitiesData(citiesArray);
            })
            .catch(error => {
                console.error('There was an error fetching the cities data!', error);
            });
    };

    useEffect(() => {
        fetchSeekers(); // Fetch all seekers initially
        fetchCitiesData(); // Fetch city data initially
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchSeekers(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchSeekers(''); // Fetch all seekers again with an empty search term
    };

    const toggleDetails = (email) => {
        setExpandedSeeker(expandedSeeker === email ? null : email);
    };

    const handleEdit = (seekerEmail) => {
        console.log(`Edit seeker with email: ${seekerEmail}`);
    };

    const handleDelete = (seekerEmail) => {
        if (window.confirm('Are you sure you want to delete this seeker?')) {
            console.log(`Delete seeker with email: ${seekerEmail}`);
            setSeekers(prevSeekers => prevSeekers.filter(seeker => seeker.email !== seekerEmail));
        }
    };

    // Aggregate job statuses across all seekers
    const aggregateJobStatusData = () => {
        let accepted = 0, rejected = 0, hold = 0;

        seekers.forEach(seeker => {
            seeker.applied_jobs.forEach(job => {
                if (job.status === 'accepted') accepted++;
                else if (job.status === 'rejected') rejected++;
                else if (job.status === 'hold') hold++;
            });
        });

        return [accepted, rejected, hold];
    };

    const getAggregatedChartData = () => {
        const [accepted, rejected, hold] = aggregateJobStatusData();

        return {
            labels: ['Accepted', 'Rejected', 'Hold'],
            datasets: [{
                data: [accepted, rejected, hold],
                backgroundColor: ['#4caf50', '#f44336', '#ffeb3b'],
                borderColor: '#fff',
                borderWidth: 1,
            }]
        };
    };

    const getCitiesChartData = () => {
        const labels = citiesData.map(city => city.name);
        const data = citiesData.map(city => city.seekersCount);

        return {
            labels,
            datasets: [{
                label: 'Seekers Count',
                data,
                backgroundColor: '#3b82f6',
                borderColor: '#fff',
                borderWidth: 1,
            }]
        };
    };

    // Calculate total seekers from citiesData
    const totalSeekers = citiesData.reduce((total, city) => total + city.seekersCount, 0);

    const displayedSeekers = initialLoad ? seekers.slice(0, 5) : seekers;

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Seekers</h1>

            {/* Search Box */}
            <form onSubmit={handleSearchSubmit} className="mb-8">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="px-4 py-2 text-gray-600 border-none cursor-pointer hover:text-gray-900 transition-colors duration-300"
                        >
                            &times;
                        </button>
                    )}
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or city"
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

            <div className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">Overall Job Application Status</h3>
                        {seekers.length === 0 ? (
                            <p className="text-gray-600">No data available</p>
                        ) : (
                            <>
                                <Pie
                                    data={getAggregatedChartData()}
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
                                                        return `${tooltipItem.label}: ${value} (${percentage}%)`;
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                />
                                <p className="mt-4 text-gray-600">Total Applications: {seekers.reduce((acc, seeker) => acc + seeker.applied_jobs.length, 0)}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center w-full" style={{ maxWidth: '800px' }}>
                        <h3 className="text-lg font-semibold mb-2">Job Seekers by City</h3>
                        {citiesData.length === 0 ? (
                            <p className="text-gray-600">No data available</p>
                        ) : (
                            <>
                                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
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
                                                            const value = tooltipItem.raw;
                                                            return `${tooltipItem.label}: ${value}`;
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    beginAtZero: true,
                                                },
                                                y: {
                                                    beginAtZero: true,
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <p className="mt-4 text-gray-600">Total Seekers: {totalSeekers}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {displayedSeekers.map(seeker => (
                <div key={seeker.email} className="relative bg-white border border-gray-200 rounded-lg shadow-lg mb-6 p-6">
                    <div className='grid grid-cols-2 gap-6 mb-10'>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{`${seeker.first_name} ${seeker.last_name}`}</h2>
                            <p className="text-gray-600"><strong>Email:</strong> {seeker.email}</p>
                            <p className="text-gray-600"><strong>Address:</strong> {seeker.address}</p>
                            <p className="text-gray-600"><strong>Phone:</strong> {seeker.phonenumber}</p>
                        </div>
                    </div>

                    {expandedSeeker === seeker.email && (
                        <div className="mt-4">
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Saved Jobs</h3>
                                {seeker.saved_jobs.length > 0 ? (
                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                        {seeker.saved_jobs.map(job => (
                                            <li key={job.job_id}>Job ID: {job.job_id}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No saved jobs</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Applied Jobs</h3>
                                {seeker.applied_jobs.length > 0 ? (
                                    <ul className="list-disc list-inside ml-4 text-gray-600">
                                        {seeker.applied_jobs.map(job => (
                                            <li key={job.job_id}>Job ID: {job.job_id}, Status: {job.status}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No applied jobs</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Curriculum Vitae</h3>
                                {seeker.curriculum_vitae.map(cv => (
                                    <div key={cv.id} className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">CV ID: {cv.id}</h4>
                                        <h5 className="text-md font-medium text-gray-600 mb-2">Educations</h5>
                                        {cv.educations.length > 0 ? (
                                            <ul className="list-disc list-inside ml-4 text-gray-600">
                                                {cv.educations.map(edu => (
                                                    <li key={edu.id}>
                                                        {edu.degree} in {edu.field_of_study} from {edu.institution}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No education details</p>
                                        )}
                                        <h5 className="text-md font-medium text-gray-600 mt-4 mb-2">Job Experiences</h5>
                                        {cv.jobExperiences.length > 0 ? (
                                            <ul className="list-disc list-inside ml-4 text-gray-600">
                                                {cv.jobExperiences.map(exp => (
                                                    <li key={exp.id}>
                                                        {exp.job_title} at {exp.company} ({exp.start_date} - {exp.end_date})
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-500">No job experiences</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => handleEdit(seeker.email)}
                            className="px-4 py-2 border border-green-600 hover:bg-green-700 hover:text-white rounded transition-colors duration-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(seeker.email)}
                            className="px-4 py-2 border border-red-600 hover:text-white hover:bg-red-700 rounded transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </div>

                    <button
                        onClick={() => toggleDetails(seeker.email)}
                        className={`absolute bottom-4 right-4 px-4 py-2 text-white font-semibold rounded ${expandedSeeker === seeker.email ? 'bg-blue-600' : 'bg-blue-500'} transition-colors duration-300`}
                    >
                        {expandedSeeker === seeker.email ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AdminSeekers;
