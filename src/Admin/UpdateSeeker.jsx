import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

const UpdateSeeker = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('Seeker_token'); // This is not used for the current request

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [citiesLoaded, setCitiesLoaded] = useState(false);
    const [address, setAddress] = useState("");

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/cities');
                const formattedCities = response.data.map(city => ({
                    value: city.id,
                    label: city.city_name
                }));
                setCities(formattedCities);
                setCitiesLoaded(true);
            } catch (error) {
                console.error('Error fetching cities:', error);
                toast.error('Failed to load cities.');
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        if (!citiesLoaded) return;

        const fetchSeekerInfo = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/seeker/all'); // Updated endpoint
                if (response.status === 200) {
                    const data = response.data[0]; // Assuming the first seeker in the response

                    setFirstName(data.first_name || '');
                    setLastName(data.last_name || '');
                    setPhonenumber(data.phonenumber || '');
                    setEmail(data.email || '');
                    setAddress(data.address || '');

                    // Assuming you want to use the address as city if no city ID
                    const cityOption = cities.find(city => city.label === data.address);
                    setSelectedCity(cityOption || { label: data.address, value: '' });
                } else {
                    throw new Error(`Unexpected status code: ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching seeker info:', error.response ? error.response.data : error.message);
                toast.error(`Failed to load seeker information: ${error.response ? error.response.data.message : error.message}`);
            }
        };

        fetchSeekerInfo();
    }, [citiesLoaded, cities]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const updatedSeeker = {
            id: 1, // Replace with actual seeker ID if available
            first_name: firstName,
            last_name: lastName,
            phonenumber,
            email,
            city_id: selectedCity ? selectedCity.value : '',
            ...(password && { password }),
        };

        try {
            setIsLoading(true);
            const response = await axios.put('http://127.0.0.1:8000/api/seeker/edit-without-token', updatedSeeker, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success("Information updated successfully");
                navigate('/admin');  // Redirect to /seeker-dashboard on success
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

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                <h2 className="text-center text-2xl font-bold mb-6">Update Your Information</h2>
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
                        <label htmlFor="city" className="block text-gray-700 font-bold mb-2">
                            City
                        </label>

                        <p className="mb-2 text-gray-600">Current City: {address}</p>

                        <CreatableSelect
                            id="city"
                            name="city"
                            options={cities}
                            onChange={handleCityChange}
                            className="border rounded w-full py-2 px-3"
                            placeholder="Select or create a city"
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
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Password"
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
                            name="confirmPassword"
                            className="border rounded w-full py-2 px-3"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/seeker-dashboard')} // Cancel button action
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

export default UpdateSeeker;
