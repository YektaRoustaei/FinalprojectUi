import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles

const Cities = () => {
    const [cities, setCities] = useState([]);
    const [newCity, setNewCity] = useState({ city_name: '', Latitude: '', Longitude: '' });
    const [editingCity, setEditingCity] = useState(null);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const token = localStorage.getItem('Admin_token');
            const response = await axios.get('http://127.0.0.1:8000/api/city/index', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCities(response.data.cities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCity((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddCity = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('Admin_token');
            await axios.post('http://127.0.0.1:8000/api/city/register', newCity, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            fetchCities();
            setNewCity({ city_name: '', Latitude: '', Longitude: '' });
            toast.success('City added successfully!');
        } catch (error) {
            console.error('Error adding city:', error);
            toast.error('Failed to add city.');
        }
    };

    const handleUpdateCity = async (id) => {
        try {
            const token = localStorage.getItem('Admin_token');
            await axios.put(`http://127.0.0.1:8000/api/city/update/${id}`, editingCity, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            fetchCities();
            setEditingCity(null);
            toast.success('City updated successfully!');
        } catch (error) {
            console.error('Error updating city:', error);
            toast.error('Failed to update city.');
        }
    };

    const handleDeleteCity = async (id) => {
        try {
            const token = localStorage.getItem('Admin_token');
            await axios.delete(`http://127.0.0.1:8000/api/city/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            fetchCities();
            toast.success('City removed successfully!');
        } catch (error) {
            console.error('Error deleting city:', error);
            toast.error('Failed to remove city.');
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <ToastContainer />

            <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Cities</h1>

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New City</h2>
                <form onSubmit={handleAddCity} className="space-y-4">
                    <input
                        type="text"
                        name="city_name"
                        placeholder="City Name"
                        value={newCity.city_name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        name="Latitude"
                        placeholder="Latitude"
                        value={newCity.Latitude}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        name="Longitude"
                        placeholder="Longitude"
                        value={newCity.Longitude}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
                    >
                        Add City
                    </button>
                </form>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">City List</h2>
                <ul className="space-y-4">
                    {cities.map((city) => (
                        <li key={city.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
                            <span className="text-gray-800">{city.city_name} (Lat: {city.latitude}, Lon: {city.longitude})</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => setEditingCity(city)}
                                    className="px-3 py-1 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteCity(city.id)}
                                    className="px-3 py-1 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {editingCity && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Update City</h2>
                        <input
                            type="text"
                            name="city_name"
                            placeholder="City Name"
                            value={editingCity.city_name}
                            onChange={(e) => setEditingCity((prev) => ({ ...prev, city_name: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            name="Latitude"
                            placeholder="Latitude"
                            value={editingCity.Latitude}
                            onChange={(e) => setEditingCity((prev) => ({ ...prev, Latitude: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <input
                            type="number"
                            name="Longitude"
                            placeholder="Longitude"
                            value={editingCity.Longitude}
                            onChange={(e) => setEditingCity((prev) => ({ ...prev, Longitude: e.target.value }))}
                            required
                            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={() => handleUpdateCity(editingCity.id)}
                                className="py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                            >
                                Update City
                            </button>
                            <button
                                onClick={() => setEditingCity(null)}
                                className="py-2 px-4 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cities;
