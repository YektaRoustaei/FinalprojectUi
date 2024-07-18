import { useEffect, useState } from "react";
import Hero from '../components/Hero.jsx';
import JobCard from '../components/JobCard.jsx';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/joblist')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the job postings!', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Hero />
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg my-4">
                <span className="font-semibold text-gray-400 uppercase">Recent Jobs</span>
                {loading && <p>Loading jobs...</p>}
                {error && <p className="text-red-500">There was an error loading the jobs: {error.message}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    {!loading && !error && jobs.slice(0, 3).map((job) => (
                        <a key={job.id} href={`/jobs/${job.id}`} className="hover:text-gray-800 dark:hover:text-gray-400">
                            <JobCard job={job} />
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
