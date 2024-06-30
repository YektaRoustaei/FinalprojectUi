import { useEffect, useState } from 'react';

const JobsList = () => {
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
        <div>
            <h1>Job Postings</h1>
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>{job.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default JobsList;
