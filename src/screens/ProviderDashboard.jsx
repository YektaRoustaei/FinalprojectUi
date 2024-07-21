import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Provider_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/provider/get-info', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    setUser(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            navigate('/loginprovider');
        }
    }, [navigate]);

    const handleLogout = () => {
        const token = localStorage.getItem('Provider_token');

        if (token) {
            axios.post('http://127.0.0.1:8000/api/provider/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(() => {
                    localStorage.removeItem('Provider_token');
                    setUser(null);
                    toast.success('Logout successful.');
                    window.location.reload(); // Refresh the page after logout
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                });
        }
    };

    const handleEditProfile = () => {
        // Implement edit profile functionality here
        console.log('Editing profile...');
    };

    const navigateToCreatedJobs = () => {
        navigate('/provider-dashboard/jobs');
    };

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Job Provider Dashboard</h1>
                {loading ? (
                    <div className="text-gray-600">Loading...</div>
                ) : user ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-lg font-semibold mb-4">User Details</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="font-medium">Email:</div>
                                <div>{user.email}</div>
                                <div className="font-medium">Company Name:</div>
                                <div>{user.company_name}</div>
                                <div className="font-medium">Description:</div>
                                <div>{user.description}</div>
                                <div className="font-medium">Address:</div>
                                <div>{user.address}</div>
                                <div className="font-medium">Telephone:</div>
                                <div>{user.telephone}</div>
                                <div className="col-span-2 flex justify-start">
                                    <button
                                        onClick={handleEditProfile}
                                        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition duration-200"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <h2 className="text-lg font-semibold mb-4">Manage Jobs</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl">
                                    <p className="text-lg font-semibold mb-2">Number of Created Jobs</p>
                                    <p className="text-gray-700">{user.job_count}</p>
                                    <button
                                        onClick={navigateToCreatedJobs}
                                        className="mt-4 px-4 py-2 border border-blue-600 font-semibold rounded hover:bg-blue-700 transition duration-200 hover:text-white"
                                    >
                                        Manage All Jobs
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl">
                                    <p className="text-lg font-semibold mb-2">Number of Applicants</p>
                                    <p className="text-gray-700">...</p>
                                    <button
                                        className="mt-4 px-4 py-2 border border-blue-600 font-semibold rounded hover:bg-blue-700 transition duration-200 hover:text-white"
                                    >
                                        Manage Applicants
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-600">No user details available.</div>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
