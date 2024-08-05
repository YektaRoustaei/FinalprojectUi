import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import AdminJobs from './AdminJobs.jsx';
import AdminProviders from './AdminProviders.jsx';
import AdminSeekers from './AdminSeekers.jsx';
import AdminCities from './Cities.jsx'; // Import the new component

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [selectedSection, setSelectedSection] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('Admin_token');
        if (!token) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        const token = localStorage.getItem('Admin_token');

        if (token) {
            console.log('Token found:', token); // Added logging

            axios.post('http://127.0.0.1:8000/api/admin/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log('Logout response:', response.data); // Added logging
                    localStorage.removeItem('Admin_token');
                    setUser(null);
                    toast.success('Logout successful.');
                    navigate('/admin/login');
                })
                .catch(error => {
                    console.error('Error logging out:', error.response ? error.response.data : error.message);
                    if (error.response && error.response.data && error.response.data.error === 'Unauthorized') {
                        toast.error('Invalid token. Please log in again.');
                        localStorage.removeItem('Admin_token');
                        navigate('/admin/login');
                    } else {
                        toast.error('Logout failed.');
                    }
                });
        } else {
            toast.error('No token found.');
        }
    };

    return (
        <section className="min-h-screen flex flex-col">
            <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md text-center">
                <div className='text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl mx-auto'>
                    Welcome to Admin Dashboard
                </div>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white font-bold rounded"
                >
                    Logout
                </button>
            </div>
            <div className="flex flex-1">
                <div className="w-64 bg-gray-800 text-white flex flex-col">
                    <div className="flex-1 p-4 space-y-4">
                        <a href='#'
                           onClick={() => setSelectedSection('providers')}
                           className={`block p-2 rounded transition ${
                               selectedSection === 'providers' ? 'bg-gray-700' : 'hover:bg-gray-700'
                           }`}>
                            Manage Job Providers
                        </a>
                        <a href='#'
                           onClick={() => setSelectedSection('seekers')}
                           className={`block p-2 rounded transition ${
                               selectedSection === 'seekers' ? 'bg-gray-700' : 'hover:bg-gray-700'
                           }`}>
                            Manage Job Seekers
                        </a>
                        <a href='#'
                           onClick={() => setSelectedSection('jobs')}
                           className={`block p-2 rounded transition ${
                               selectedSection === 'jobs' ? 'bg-gray-700' : 'hover:bg-gray-700'
                           }`}>
                            Manage Jobs
                        </a>
                        <a href='#'
                           onClick={() => setSelectedSection('cities')}
                           className={`block p-2 rounded transition ${
                               selectedSection === 'cities' ? 'bg-gray-700' : 'hover:bg-gray-700'
                           }`}>
                            Cities Management
                        </a>
                    </div>
                </div>
                <div className="flex-1 p-4">
                    {selectedSection === 'jobs' && <AdminJobs />}
                    {selectedSection === 'seekers' && <AdminSeekers />}
                    {selectedSection === 'providers' && <AdminProviders />}
                    {selectedSection === 'cities' && <AdminCities />} {/* Render the new component */}
                </div>
            </div>
        </section>
    );
}

export default AdminDashboard;
