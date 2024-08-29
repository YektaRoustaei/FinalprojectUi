import { useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';

const EditProviderInfo = () => {
    const navigate = useNavigate();
    const { providerId } = useParams(); // Extract providerId from URL parameters

    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('Provider_token');
        if (token && providerId) {
            axios.get(`http://127.0.0.1:8000/api/provider/get-info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then(response => {
                    const { company_name, description, telephone, email, address } = response.data;
                    setCompanyName(company_name);
                    setDescription(description);
                    setTelephone(telephone);
                    setEmail(email);
                    setSelectedCity(address); // Set city as address
                })
                .catch(error => {
                    console.error('Error fetching provider info:', error);
                    toast.error('Failed to load provider info.');
                });
        } else {
            navigate('/loginprovider'); // Redirect if no providerId or token
        }

        const fetchCities = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/cities');
                setCities(response.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
                toast.error('Failed to load cities.');
            }
        };

        fetchCities();
    }, [providerId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProvider = {
            company_name: companyName,
            description,
            telephone,
            email,
            address: selectedCity,
        };

        try {
            setIsLoading(true);
            const token = localStorage.getItem('Provider_token');
            const response = await axios.put(`http://127.0.0.1:8000/api/provider/edit/${providerId}`, updatedProvider, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                toast.success("Provider information updated successfully");
                navigate('/provider-dashboard');
            } else {
                toast.error('Update failed. Please try again.');
            }

        } catch (err) {
            console.error('Error updating info:', err);
            toast.error('Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Edit Provider Info</h2>
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
                        <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
                            City
                        </label>
                        <select
                            id="city"
                            name="city"
                            className="border rounded w-full py-2 px-3"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            required
                        >
                            <option value="">Select a city</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.city_name}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
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
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Info'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default EditProviderInfo;
