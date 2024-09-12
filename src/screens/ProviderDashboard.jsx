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
                    navigate('/'); // Redirect to home page after logout
                    window.location.reload(); // Refresh the page after logout
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                });
        }
    };

    const handleEditProfile = () => {
        if (user) {
            navigate(`/provider/edit/${user.id}`);
        }
    };

    const handleDeleteProfile = () => {
        const token = localStorage.getItem('Provider_token');
        const providerId = user?.id; // Ensure user object has ID

        if (token && providerId) {
            axios.delete(`http://127.0.0.1:8000/api/provider/delete/${providerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    localStorage.removeItem('Provider_token');
                    setUser(null);
                    toast.success('Profile deleted successfully.');
                    navigate('/'); // Redirect to the home page after deletion
                })
                .catch(error => {
                    console.error('Error deleting profile:', error);
                    toast.error('Failed to delete profile.');
                });
        }
    };

    const navigateToCreatedJobs = () => {
        navigate('/provider-dashboard/jobs');
    };

    const navigateToCreateJobs = () => {
        navigate('/add-job');
    };
    const navigatetoSavedCV =()=>{
        if (user) {
            navigate(`/savedcv/${user.id}`);
        }
    }

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
                                <div className="flex mt-10">
                                    <button
                                        onClick={handleDeleteProfile}
                                        className="border-red-600 border-2 px-4 py-2 rounded-lg hover:bg-red-800 hover:text-white transition duration-200"
                                    >
                                        Delete Profile
                                    </button>
                                </div>
                                <div className="mt-10 justify-start flex ">
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
                                    <p className="text-lg font-semibold mb-2">Create new Jobs</p>
                                    <button
                                        onClick={navigateToCreateJobs}
                                        className="mt-4 px-4 py-2 border border-blue-600 font-semibold rounded hover:bg-blue-700 transition duration-200 hover:text-white"
                                    >
                                        Create
                                    </button>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl">
                                    <p className="text-lg font-semibold mb-2">Saved CV's</p>
                                    <button
                                        onClick={navigatetoSavedCV}
                                        className="mt-4 px-4 py-2 border border-blue-600 font-semibold rounded hover:bg-blue-700 transition duration-200 hover:text-white"
                                    >
                                        All CV's
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
