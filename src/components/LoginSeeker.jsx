import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useUser } from '../Tokens/customHooks';
import { storeTokenInLocalStorage } from '../Tokens/common';
import { useNavigate } from "react-router-dom";

const LoginSeeker = () => {
    const navigate = useNavigate();
    const { user, authenticated } = useUser();

    useEffect(() => {
        if (user || authenticated) {
            console.log('Navigating to /seeker-dashboard');
            navigate('/seeker-dashboard');
        }
    }, [user, authenticated, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/seeker/login',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({ email, password }),
            });

            if (response.status === 200 && response.data?.Seeker_token) {
                storeTokenInLocalStorage(response.data.Seeker_token, 'Seeker_token');
                toast.success('Login successful.');
                console.log('Login successful, navigating to /seeker-dashboard');
                navigate('/seeker-dashboard');
            } else {
                console.log('Unexpected response: ', response);
                toast.error('Failed to login: Unexpected response');
            }
        } catch (err) {
            console.log('Some error occurred during signing in: ', err);
            toast.error(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Job Seeker Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default LoginSeeker;
