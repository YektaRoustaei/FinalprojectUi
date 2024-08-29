import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const AdminProviders = () => {
    const [providers, setProviders] = useState([]);
    const [cityData, setCityData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDetails, setShowDetails] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);

    const fetchProviders = (search = '') => {
        fetch(`http://127.0.0.1:8000/api/provider/all?search=${encodeURIComponent(search)}`)
            .then(response => response.json())
            .then(data => {
                setProviders(data.providers);
                setInitialLoad(false);
            })
            .catch(error => {
                console.error('There was an error fetching the providers!', error);
            });
    };

    const fetchCityData = () => {
        fetch('http://127.0.0.1:8000/api/city/static/provider')
            .then(response => response.json())
            .then(data => {
                const cities = Object.values(data);
                setCityData(cities);
            })
            .catch(error => {
                console.error('There was an error fetching the city data!', error);
            });
    };

    useEffect(() => {
        fetchProviders();
        fetchCityData();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProviders(searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        fetchProviders('');
    };

    const toggleDetails = (providerId) => {
        setShowDetails(prevState => ({
            ...prevState,
            [providerId]: !prevState[providerId]
        }));
    };

    const handleEdit = (providerId) => {
        console.log(`Edit provider with ID: ${providerId}`);
    };

    const handleDelete = (providerId) => {
        if (window.confirm('Are you sure you want to delete this provider?')) {
            console.log(`Delete provider with ID: ${providerId}`);
            setProviders(prevProviders => prevProviders.filter(provider => provider.id !== providerId));
        }
    };

    const getAggregatedChartData = () => {
        let totalHold = 0, totalAccepted = 0, totalRejected = 0;

        providers.forEach(provider => {
            totalHold += provider.job_statuses.hold;
            totalAccepted += provider.job_statuses.accepted;
            totalRejected += provider.job_statuses.rejected;
        });

        return {
            labels: ['Hold', 'Accepted', 'Rejected'],
            datasets: [{
                data: [totalHold, totalAccepted, totalRejected],
                backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
                borderColor: '#fff',
                borderWidth: 1,
            }],
            total: totalHold + totalAccepted + totalRejected,
        };
    };

    const getBarChartData = () => {
        const cityLabels = cityData.map(city => city.city_name);
        const providerCounts = cityData.map(city => city.providers_count);

        return {
            labels: cityLabels,
            datasets: [{
                label: 'Number of Providers',
                data: providerCounts,
                backgroundColor: '#3b82f6', // Use a color that matches the Seekers chart
                borderColor: '#fff',
                borderWidth: 1,
            }],
        };
    };

    const totalProviders = cityData.reduce((total, city) => total + city.providers_count, 0);

    const displayedProviders = initialLoad ? providers.slice(0, 5) : providers;

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Providers</h1>

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

            <div className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <h3 className="text-lg font-semibold mb-2">Overall Job Application Status</h3>
                        {providers.length === 0 ? (
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
                                <p className="mt-4 text-gray-600">Total Applications: {getAggregatedChartData().total}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative bg-white border rounded-lg shadow-lg mb-6 p-6">
                <div className="flex justify-center">
                    <div className="flex flex-col items-center w-full" style={{ maxWidth: '800px' }}>
                        <h3 className="text-lg font-semibold mb-2">Number of Providers in Each City</h3>
                        {cityData.length === 0 ? (
                            <p className="text-gray-600">No data available</p>
                        ) : (
                            <>
                                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                                    <Bar
                                        data={getBarChartData()}
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
                                                    ticks: {
                                                        autoSkip: false,
                                                    },
                                                    title: {
                                                        display: true,
                                                        text: 'City',
                                                    },
                                                },
                                                y: {
                                                    beginAtZero: true,
                                                    title: {
                                                        display: true,
                                                        text: 'Number of Providers',
                                                    },
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <p className="mt-4 text-gray-600">Total Providers: {totalProviders}</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {displayedProviders.map(provider => (
                <div key={provider.id} className="relative bg-white border border-gray-200 rounded-lg shadow-lg mb-6 p-6">
                    <div className='grid grid-cols-2 gap-6 mb-10'>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold text-gray-800">{provider.company_name}</h2>
                            <p className="text-gray-600"><strong>Address:</strong> {provider.address}</p>
                            <p className="text-gray-600"><strong>Telephone:</strong> {provider.telephone}</p>
                            <p className="text-gray-600"><strong>Email:</strong> {provider.email}</p>
                            <p className="text-gray-600"><strong>Job Count:</strong> {provider.job_count}</p>
                        </div>
                    </div>

                    {showDetails[provider.id] && (
                        <div className="mt-4">
                            <p><strong>Description:</strong> {provider.description}</p>
                            {/* Additional provider details and jobs */}
                        </div>
                    )}

                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                            onClick={() => handleEdit(provider.id)}
                            className="px-4 py-2 border border-green-600 hover:bg-green-700 hover:text-white rounded transition-colors duration-300"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(provider.id)}
                            className="px-4 py-2 border border-red-600 hover:text-white hover:bg-red-700 rounded transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </div>

                    <button
                        onClick={() => toggleDetails(provider.id)}
                        className={`absolute bottom-4 right-4 px-4 py-2 text-white font-semibold rounded ${showDetails[provider.id] ? 'bg-blue-600' : 'bg-blue-500'} transition-colors duration-300`}
                    >
                        {showDetails[provider.id] ? 'Hide Details' : 'Show Details'}
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AdminProviders;
