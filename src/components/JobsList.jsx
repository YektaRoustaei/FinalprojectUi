import { useEffect, useState } from 'react';
import SearchBox from "./SearchBox.jsx";
import JobListCard from "./JobListCard.jsx";
import FilterComponent from "./FilterComponent.jsx";
import PropTypes from 'prop-types';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedFilters, setSelectedFilters] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/joblist')
            .then(response => response.json())
            .then(data => {
                setJobs(data);
                setFilteredJobs(data); // Initialize filteredJobs with all jobs
            })
            .catch(error => {
                console.error('There was an error fetching the job postings!', error);
            });
    }, []);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/companyList')
            .then(response => response.json())
            .then(data => {
                setCompanies(data);
            })
            .catch(error => {
                console.error('There was an error fetching the companies!', error);
            });
    }, []);

    useEffect(() => {
        const filterJobs = () => {
            let filtered = jobs;

            if (selectedFilters.location?.length) {
                filtered = filtered.filter(job =>
                    selectedFilters.location.includes(getAddress(job.provider_id))
                );
            }

            if (selectedFilters.type?.length) {
                filtered = filtered.filter(job =>
                    selectedFilters.type.includes(job.type)
                );
            }

            setFilteredJobs(filtered);
        };

        filterJobs();
    }, [jobs, selectedFilters]);

    const getCompanyName = (providerId) => {
        const company = companies.find(company => company.id === providerId);
        return company ? company.company_name : 'Unknown Company';
    };

    const getAddress = (providerId) => {
        const company = companies.find(company => company.id === providerId);
        return company ? company.address : 'Unknown Address';
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
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const uniqueLocations = [...new Set(companies.map(company => company.address))];
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
                <div className="col-span-1 bg-white p-2 rounded-lg shadow-md ">
                    <FilterComponent
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <div className="col-span-3">
                    <div className=" text-blue-950 font-bold">
                        {filteredJobs.length} jobs found
                    </div>
                    {currentJobs.map((job) => (
                        <div key={job.id} className="hover:text-gray-800 dark:hover:text-gray-400 mb-4">
                            <JobListCard
                                job={job}
                                companyName={getCompanyName(job.provider_id)}
                                address={getAddress(job.provider_id)}
                            />
                        </div>
                    ))}
                    <div className="flex justify-center mt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </section>
        </>
    );
};

const Pagination = ({currentPage, totalPages, onPageChange}) => {
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
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
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
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
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
