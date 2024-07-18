import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SeekerSignUp = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [phonenumber, setPhonenumber] = useState(""); // Updated to match backend expected field
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

        const newSeeker = {
            first_name: firstName,
            last_name: lastName,
            address,
            phonenumber, // Convert phonenumber to integer
            email,
            password
        };

        try {
            setIsLoading(true);
            const response =  await axios({
                method: 'POST',
                url: 'http://127.0.0.1:8000/api/seeker/register',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(newSeeker),
            });

            if (response.status === 200 && response.data && response.data.id) {
                toast.success("Registration successful");
                navigate('/loginseeker');
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
                        <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="border rounded w-full py-2 px-3"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="phonenumber" className="block text-gray-700 font-bold mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phonenumber"
                            name="phonenumber"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Phone Number"
                            value={phonenumber}
                            onChange={(e) => setPhonenumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                            City
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

export default SeekerSignUp;
