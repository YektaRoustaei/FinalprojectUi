import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FilterComponentWithoutToken = ({ onFilterChange }) => {
    const [cities, setCities] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/search');
                const jobs = response.data.jobs || [];

                // Debugging: Log the API response to the console
                console.log('API Response:', response.data);

                // Extract unique cities and job types
                const uniqueCities = [...new Set(jobs.map(job => job.provider_city).filter(Boolean))];
                const uniqueJobTypes = [...new Set(jobs.map(job => job.type).filter(Boolean))];

                // Debugging: Log the extracted filters
                console.log('Unique Cities:', uniqueCities);
                console.log('Unique Job Types:', uniqueJobTypes);

                // Set the state with the unique values
                setCities(uniqueCities);
                setJobTypes(uniqueJobTypes);
            } catch (error) {
                console.error('Error fetching job data:', error);
            }
        };

        fetchFilters();
    }, []);

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
        <div className="bg-white p-4 m-2 rounded-lg shadow-md w-full max-w-xs border-t-2">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>

            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2 border-b-2">City</h3>
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
                            <label htmlFor={`city-${index}`} className="text-sm font-medium text-gray-700">
                                {city}
                            </label>
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
                            <label htmlFor={`job-type-${index}`} className="text-sm font-medium text-gray-700">
                                {type}
                            </label>
                        </div>
                    ))
                ) : (
                    <p>No job types available.</p>
                )}
            </div>
        </div>
    );
};

FilterComponentWithoutToken.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
};

export default FilterComponentWithoutToken;
