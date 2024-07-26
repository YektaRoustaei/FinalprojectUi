import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBox = ({ onSearchParamsChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState(''); // Keep this if you plan to use it later
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearchParamsChange(searchTerm, location);
        navigate('/jobslist');
    };

    return (
        <div>

            <form className="w-full max-w-3xl mx-auto mt-4" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row relative">
                    <div className="relative flex-1">
                        <input
                            type="search"
                            id="search_term"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            name="search_term"
                            className="block w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Jobs, Internships, Companies ..."
                        />
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            name="location"
                            className="block w-full p-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10"
                            placeholder="Location (optional)"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <FontAwesomeIcon icon={faLocationDot} className="text-gray-400" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="flex-shrink-0 p-3 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

SearchBox.propTypes = {
    onSearchParamsChange: PropTypes.func.isRequired,
};

export default SearchBox;
