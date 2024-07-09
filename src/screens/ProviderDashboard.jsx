import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
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
                    Authorization: `Bearer ${token}`
                }
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
    }, []);

    const handleLogout = () => {
        const token = localStorage.getItem('Provider_token');

        if (token) {
            axios.post('http://127.0.0.1:8000/api/provider/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    localStorage.removeItem('Provider_token');
                    setUser(null);
                    toast.success('Logout successful.');
                    navigate('/login');
                })
                .catch(error => {
                    console.error('Error logging out:', error);
                });
        }
    };

    return (
        <>
            <div className="p-16 bg-gray-800 h-screen">
                <div className="text-2xl mb-4 font-bold text-white">Dashboard</div>
                {loading ? (
                    <div className="text-white">Loading...</div>
                ) : user ? (
                    <div className='text-white'>
                        <div className="text-lg text-bold mb-2">User Details</div>
                        <div className="flex">
                            <div className="w-48 font-medium">
                                <div>Email:</div>
                                <div>Company Name:</div>
                                <div>Description:</div>
                                <div>Address:</div>
                                <div>Telephone:</div>
                            </div>
                            <div>
                                <div>{user.email}</div>
                                <div>{user.company_name}</div>
                                <div>{user.description}</div>
                                <div>{user.address}</div>
                                <div>{user.telephone}</div>

                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-4 px-4 py-2 bg-red-600 text-white font-bold rounded"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="text-white">No user details available.</div>
                )}
            </div>
        </>
    );
};

export default ProviderDashboard;
