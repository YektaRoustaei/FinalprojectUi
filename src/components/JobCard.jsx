import {useEffect, useState} from "react";

const JobCard =()=>{
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
     return <>
         {jobs.map(job => (
         <div key={job.id} className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
    <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{job.title}</h5>
    </a>
    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{job.description}</p>
    <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Read more

    </a>
</div>
         ))}
     </>
}
export default JobCard