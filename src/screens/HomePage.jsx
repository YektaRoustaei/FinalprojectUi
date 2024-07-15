import { useEffect, useState } from "react";
import Hero from '../components/Hero.jsx';
import JobCard from '../components/JobCard.jsx';

const HomePage = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/joblist')
            .then(response => response.json())
            .then(data => {
                setJobs(data);
            })
            .catch(error => {
                console.error('There was an error fetching the job postings!', error);
            });
    }, []);

    return (
        <>

            <Hero />
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg my-4">
                <span className="font-semibold text-gray-400 uppercase">Recent Jobs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    {jobs.slice(0, 3).map((job) => (
                        <a key={job.id} href="#" className="hover:text-gray-800 dark:hover:text-gray-400">
                            <JobCard job={job} />
                        </a>
                    ))}
                </div>
            </div>


        </>
    )
}

export default HomePage;
