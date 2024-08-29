import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the default styles
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const Cities = () => {
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchCityStatistics();
    }, []);

    const fetchCityStatistics = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/city/static');
            const data = Object.values(response.data);
            setCities(data);
        } catch (error) {
            console.error('Error fetching city statistics:', error);
            toast.error('Failed to fetch city statistics');
        }
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <ToastContainer />

            <h1 className="text-3xl font-bold mb-6 text-gray-800">City Statistics</h1>

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">City Statistics Chart</h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={cities}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="seekers_count" fill="#8884d8" name="Job Seekers" />
                        <Bar dataKey="applied_jobs_count" fill="#82ca9d" name="Applied Jobs" />
                        <Bar dataKey="accepted_jobs_count" fill="#ffc658" name="Accepted Jobs" />
                        <Bar dataKey="rejected_jobs_count" fill="#ff7300" name="Rejected Jobs" />
                        <Bar dataKey="job_postings_count" fill="#ff6f61" name="Job Postings" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Cities;
