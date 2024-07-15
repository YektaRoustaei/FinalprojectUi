import { useState } from 'react';
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const SearchBox = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [location, setLocation] = useState('');

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform search with job type (dropdownVisible) and location
        console.log('Searching for:', {
            jobType: dropdownVisible,
            location: location
        });
        // You can add your search logic here
    };

    return (
        <form className="w-full max-w-xl mx-auto " onSubmit={handleSubmit}>
            <div className="flex relative">
                <label
                    htmlFor="search-dropdown"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                >
                    Find Jobs
                </label>
                <button
                    id="dropdown-button"
                    onClick={toggleDropdown}
                    className=" rounded-l-lg flex-shrink-0 z-10 inline-flex items-center py-2.5 px-2 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
                    type="button"
                >
                    All Types{' '}
                    <svg
                        className="w-2.5 h-2.5 ml-2.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 10 6"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                        />
                    </svg>
                </button>
                <div
                    id="dropdown"
                    className={`absolute left-0 top-full mt-1 z-10 ${dropdownVisible ? 'block' : 'hidden'
                    } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 `}
                >
                    <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdown-button"
                    >
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Full Time
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Part Time
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Internship
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                Contract
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="relative w-full">
                    <input
                        type="search"
                        id="search-dropdown"
                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search Jobs, Internships, Companies ..."
                        required
                    />
                </div>
                <div className="relative w-full">
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pl-10"
                        placeholder="Location"
                    />
                    <div className="absolute left-3 top-2.5">
                        <FontAwesomeIcon icon={faLocationDot} className="text-gray-400"/>
                    </div>
                </div>

                <button
                    type="submit"
                    className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    <svg
                        className="w-4 h-5"
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
    );
};

export default SearchBox;
