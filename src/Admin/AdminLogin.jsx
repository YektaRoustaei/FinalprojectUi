import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '../Tokens/customHooks';
import { storeTokenInLocalStorage } from '../Tokens/common';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { user, authenticated } = useUser();

    useEffect(() => {
        if (user || authenticated) {
            navigate('/admin');
        }
    }, [user, authenticated, navigate]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/admin/login', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data?.Admin_token) {
                storeTokenInLocalStorage(response.data.Admin_token, 'Admin_token');
                toast.success('Login successful.');
                navigate('/admin');
            } else {
                toast.error('Failed to login: Unexpected response');
            }

        } catch (err) {
            toast.error(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Admin Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                            Username
                        </label>
                        <input
                            type='text'
                            id="username"
                            name="username"
                            className="border rounded w-full py-2 px-3"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default AdminLogin;
