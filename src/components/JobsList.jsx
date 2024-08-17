import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios';
import HeroSearchBox from './HeroSearchBox';
import RecommendedCards from './RecommendedCards.jsx';
import JobListCard from './JobListCard.jsx';
import Pagination from './Pagination.jsx';
import FilterComponentWithToken from "./FilterComponentWithToken.jsx";
import FilterComponentWithoutToken from "./FilterComponentWithoutToken.jsx";

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [selectedJobType, setSelectedJobType] = useState([]);
    const jobsPerPage = 10;

    const location = useLocation();
    const token = localStorage.getItem('Seeker_token');

    // Function to parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('searchTerm') || '';
    const searchCity = queryParams.get('location') || '';

    useEffect(() => {
        const fetchJobs = async () => {
            const baseUrl = token
                ? `http://127.0.0.1:8000/api/recommend`
                : `http://127.0.0.1:8000/api/search`;

            const params = new URLSearchParams({
                search_term: searchTerm,
                city: searchCity || selectedCity.join(','),
                job_type: selectedJobType.join(',')
            });

            try {
                const response = await axios.get(`${baseUrl}?${params.toString()}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                const data = response.data.jobs; // Adjust according to your API response structure
                if (token) {
                    setRecommendedJobs(data);
                } else {
                    setJobs(data);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, [token, searchTerm, searchCity, selectedCity, selectedJobType, currentPage]);

    const handleFilterChange = (cities, jobTypes) => {
        setSelectedCity(cities);
        setSelectedJobType(jobTypes);
    };

    const startIndex = (currentPage - 1) * jobsPerPage;
    const paginatedJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

    return (
        <div className="w-full">
            <header className="pt-4 pb-4 text-center bg-blue-700 text-white">
                <h1 className="text-2xl font-bold">Search for Jobs, Internships, and Companies</h1>
                <p className="mt-2">Enter keywords and location to find opportunities that match your interests and career goals.</p>
            </header>
            <HeroSearchBox onSearchParamsChange={(term, city) => {
                // This can be used for local state if needed
                // setSearchTerm(term);
                // setSearchCity(city);
            }} />
            <div className="w-full m-4">
                <div className="w-11/12 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 mt-4">
                        <div className="flex flex-col m-4">
                            {token ? (
                                <FilterComponentWithToken onFilterChange={handleFilterChange}/>
                            ) : (
                                <FilterComponentWithoutToken onFilterChange={handleFilterChange}/>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2">
                        {token && recommendedJobs.length > 0 ? (
                            <RecommendedCards jobs={recommendedJobs}/>
                        ) : (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">All jobs</h2>
                                {paginatedJobs.map(job => (
                                    <JobListCard key={job.id} job={job}/>
                                ))}
                            </div>
                        )}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(jobs.length / jobsPerPage)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobsList;
