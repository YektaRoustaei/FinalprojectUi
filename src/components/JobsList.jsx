import { useEffect, useState } from 'react';
import SearchBox from "./SearchBox.jsx";
import FilterComponent from "./FilterComponent.jsx";
import RecommendedCards from "./RecommendedCards.jsx";
import JobListCard from "./JobListCard.jsx";
import PropTypes from 'prop-types';
import axios from "axios";

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const jobsPerPage = 10;

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/joblist')
            .then(response => response.json())
            .then(data => {
                setJobs(Array.isArray(data) ? data : []);
                setFilteredJobs(Array.isArray(data) ? data : []); // Initialize filteredJobs with an array
            })
            .catch(error => {
                console.error('There was an error fetching the job postings!', error);
            });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('Seeker_token');

        if (token) {
            axios.get('http://127.0.0.1:8000/api/recommend', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    const { jobs } = response.data;
                    setRecommendedJobs(Array.isArray(jobs) ? jobs : []);
                })
                .catch(error => {
                    console.error('There was an error fetching the recommended postings!', error);
                });
        }
    }, []);

    useEffect(() => {
        const filterJobs = () => {
            let filtered = jobs;

            if (selectedFilters.location?.length) {
                filtered = filtered.filter(job =>
                    selectedFilters.location.includes(job.provider.city.city_name)
                );
            }

            if (selectedFilters.type?.length) {
                filtered = filtered.filter(job =>
                    selectedFilters.type.includes(job.type)
                );
            }

            setFilteredJobs(Array.isArray(filtered) ? filtered : []); // Ensure filteredJobs is an array
        };

        filterJobs();
    }, [jobs, selectedFilters]);

    const getCompanyName = (providerId) => {
        const job = jobs.find(job => job.provider.id === providerId);
        return job ? job.provider.company_name : 'Unknown Company';
    };

    const handleFilterChange = (filters) => {
        setSelectedFilters(filters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = Array.isArray(filteredJobs) ? filteredJobs.slice(indexOfFirstJob, indexOfLastJob) : [];
    const totalPages = Math.ceil(Array.isArray(filteredJobs) ? filteredJobs.length / jobsPerPage : 0);

    const uniqueLocations = [...new Set(jobs.map(job => job.provider.city.city_name))];
    const uniqueJobTypes = [...new Set(jobs.map(job => job.type))];

    const filters = [
        { key: 'location', label: 'Location', options: uniqueLocations },
        { key: 'type', label: 'Job Type', options: uniqueJobTypes },
    ];

    return (
        <>
            <header className="bg-indigo-600 text-white py-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-3xl font-bold">Job Portal</h1>
                    <p className="text-lg">Find Relevant Jobs</p>
                </div>
            </header>
            <section className="my-6">
                <div className="container mx-auto">
                    <div className="flex justify-center items-center mb-4">
                        <SearchBox />
                    </div>
                </div>
            </section>
            <section className="container mx-auto grid grid-cols-4 gap-6">
                <div className="col-span-1 bg-white p-2 rounded-lg shadow-md">
                    <FilterComponent
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <div className="col-span-3">
                    {recommendedJobs.length > 0 ? (
                        <RecommendedCards
                            jobs={recommendedJobs}
                            getCompanyName={getCompanyName}
                        />
                    ) : (
                        <>
                            <div className="text-blue-950 font-bold">
                                {filteredJobs.length} jobs found
                            </div>
                            {currentJobs.length > 0 ? (
                                currentJobs.map((job) => (
                                    <div key={job.id} className="hover:text-gray-800 dark:hover:text-gray-400 mb-4">
                                        <JobListCard
                                            job={job}
                                            companyName={getCompanyName(job.provider.id)}
                                            cityName={job.provider.city.city_name} // Pass cityName directly
                                            isRecommended={false}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p>No jobs found.</p>
                            )}
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
};

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="mt-4">
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    <span className="sr-only">Previous</span>
                    &lt; {/* Use a simple HTML entity for the previous arrow */}
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'} focus:outline-offset-0`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                    <span className="sr-only">Next</span>
                    &gt; {/* Use a simple HTML entity for the next arrow */}
                </button>
            </nav>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default JobsList;
