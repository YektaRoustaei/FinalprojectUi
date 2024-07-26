import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FilterComponentWithToken = ({ onFilterChange }) => {
    const [cities, setCities] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const token = localStorage.getItem('Seeker_token');

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/recommend', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const jobs = response.data.jobs || [];

                const uniqueCities = [...new Set(jobs.map(job => job.provider_city).filter(Boolean))];
                const uniqueJobTypes = [...new Set(jobs.map(job => job.type).filter(Boolean))];

                setCities(uniqueCities);
                setJobTypes(uniqueJobTypes);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchFilters();
    }, [token]);

    const handleCityChange = (event) => {
        const city = event.target.value;
        const isChecked = event.target.checked;

        setSelectedCities(prevState => {
            const updatedCities = isChecked
                ? [...prevState, city]
                : prevState.filter(c => c !== city);

            onFilterChange(updatedCities, selectedJobTypes);
            return updatedCities;
        });
    };

    const handleJobTypeChange = (event) => {
        const jobType = event.target.value;
        const isChecked = event.target.checked;

        setSelectedJobTypes(prevState => {
            const updatedJobTypes = isChecked
                ? [...prevState, jobType]
                : prevState.filter(jt => jt !== jobType);

            onFilterChange(selectedCities, updatedJobTypes);
            return updatedJobTypes;
        });
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-xs mt-10 border-t-2">
            <h2 className="text-2xl font-bold mb-4 ">Filters</h2>

            <div className="mb-6  border-b-2">
                <h3 className="text-lg font-semibold mb-2">City</h3>
                {cities.length > 0 ? (
                    cities.map((city, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`city-${index}`}
                                value={city}
                                onChange={handleCityChange}
                                checked={selectedCities.includes(city)}
                                className="mr-2 h-4 w-4 border-gray-300 rounded"
                            />
                            <label htmlFor={`city-${index}`}
                                   className="text-sm font-medium text-gray-700">{city}</label>
                        </div>
                    ))
                ) : (
                    <p>No cities available.</p>
                )}
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 border-b-2">Job Type</h3>
                {jobTypes.length > 0 ? (
                    jobTypes.map((type, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`job-type-${index}`}
                                value={type}
                                onChange={handleJobTypeChange}
                                checked={selectedJobTypes.includes(type)}
                                className="mr-2 h-4 w-4 border-gray-300 rounded"
                            />
                            <label htmlFor={`job-type-${index}`}
                                   className="text-sm font-medium text-gray-700">{type}</label>
                        </div>
                    ))
                ) : (
                    <p>No job types available.</p>
                )}
            </div>
        </div>
    );
};

FilterComponentWithToken.propTypes = {
    onFilterChange: PropTypes.func.isRequired
};

export default FilterComponentWithToken;
