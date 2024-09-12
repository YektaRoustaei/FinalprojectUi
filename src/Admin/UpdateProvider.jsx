import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';

const UpdateProvider = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [provider, setProvider] = useState(null);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');
    const [telephone, setTelephone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { email: providerEmail } = location.state || {};

    useEffect(() => {
        if (!providerEmail) {
            setError('Provider email is missing.');
            return;
        }

        const fetchProviderData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/provider/all');
                const providerData = response.data.providers.find(p => p.email === providerEmail);

                if (providerData) {
                    setProvider(providerData);
                    setCompanyName(providerData.company_name || '');
                    setDescription(providerData.description || '');
                    setTelephone(providerData.telephone || '');
                    setEmail(providerData.email || '');
                    setSelectedCity({ label: providerData.address, value: providerData.address });
                } else {
                    setError('Provider not found.');
                }
            } catch (error) {
                console.error('Error fetching provider data:', error);
                setError('Error fetching provider data.');
            }
        };

        const fetchCities = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/cities');
                const formattedCities = response.data.map(city => ({
                    id: city.id,
                    value: city.city_name,
                    label: city.city_name,
                }));
                setCities(formattedCities);
            } catch (error) {
                console.error('Error fetching cities:', error);
                toast.error('Failed to load cities.');
            }
        };

        fetchProviderData();
        fetchCities();
    }, [providerEmail]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const updatedProvider = {
            id: provider.id,
            city_id: selectedCity.id,
            company_name: companyName,
            description,
            telephone,
            email,
            address: selectedCity ? selectedCity.value : '', // Use value field for address
            ...(password && { password }),
        };

        try {
            setIsLoading(true);
            const response = await axios.put('http://127.0.0.1:8000/api/provider/edit-without-token', updatedProvider, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success("Information updated successfully");
                navigate('/admin');
            } else {
                toast.error('Update failed. Please try again.');
            }
        } catch (err) {
            console.error('Error during update:', err);
            toast.error('Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!provider) {
        return <p>No provider found.</p>;
    }

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Update Provider Information</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="companyName"
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
                            className="border rounded w-full py-2 px-3"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="telephone" className="block text-gray-700 font-bold mb-2">
                            Telephone
                        </label>
                        <input
                            type="tel"
                            id="telephone"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Telephone"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-bold mb-2">
                            Address
                        </label>
                        <p>Current address: {provider.address}</p>
                        <CreatableSelect
                            id="address"
                            name="address"
                            options={cities}
                            onChange={handleCityChange}
                            className="border rounded w-full py-2 px-3"
                            placeholder="Select or create an address"
                            value={selectedCity}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border rounded w-full py-2 px-3"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')} // Cancel button action
                            className="w-full py-2 px-4 rounded bg-gray-400 hover:bg-gray-500 text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`w-full py-2 px-4 rounded ${isLoading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateProvider;
