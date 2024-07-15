import {useEffect, useState} from "react";

const AdminProviders = () =>{
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
        <p>prociders</p>
    </>
}
export default AdminProviders;