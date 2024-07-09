import { useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const ProviderSignUp = () => {
    const navigate = useNavigate();

    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const newProvider = {
            company_name: companyName,
            description,
            address,
            telephone, 
            email,
            password
        };

        try {
            setIsLoading(true);
            const response = await axios( {
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/provider/register',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(newProvider),
            });
            console.log('Response data:', response.data);

            if (response.status === 200 && response.data && response.data.id) {
                toast.success("Registration successful");
                navigate('/login');
            } else {
                console.log('Unexpected response format:', response.data); // Debugging log
                toast.error('Registration failed. Please try again.');
            }

        } catch (err) {
            console.log('Some error occurred during signing up: ', err);

            if (err.response) {
                console.error('Error response:', err.response.data); // Detailed error response
            }
            toast.error('Registration failed. Please try again.');
            }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Sign Up</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Company Description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telephone" className="block text-gray-700 font-bold mb-2">
                            Telephone
                        </label>
                        <input
                            type="tel"
                            id="telephone"
                            name="telephone"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            required
                        />
                    </div>
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
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Sign Up
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ProviderSignUp;
