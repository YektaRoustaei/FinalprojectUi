import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';

const RecommendedCards = ({ jobs }) => {
    const navigate = useNavigate();

    const handleCardClick = (job) => {
        navigate(`/jobslist/recommendjob/${job.id}`, {
            state: {
                job: {
                    ...job,
                    companyName: job.company_name,
                    address: job.location,
                    salary: job.salary,
                    jobSkills: job.job_skills,
                    jobType: job.type
                }
            }
        });
    };

    return (
        <section className="container mx-auto grid grid-cols-1 gap-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
            {jobs.length > 0 ? (
                jobs.map((job) => (
                    <div
                        key={job.id}
                        className="cursor-pointer w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4 transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-800"
                    >
                        <div className="mb-4">
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{job.title}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Posted by <span className="font-semibold text-gray-700 dark:text-white">{job.company_name}</span></p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-700 dark:text-gray-400 line-clamp-2">
                                <span className="font-semibold">Description:</span>
                                <span className="ml-2">{job.description}</span>

                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap">
                            {job.job_skills && job.job_skills.length > 0 && job.job_skills.map((jobSkill, index) => {
                                const isMatching = job.matching_skills.includes(jobSkill);
                                return (
                                    <span
                                        key={index}
                                        className={`inline-block text-sm px-2 py-1 rounded-full mr-2 mb-2 ${isMatching ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}
                                    >
                                        {jobSkill}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="mt-4 text-right">
                            <button
                                onClick={() => handleCardClick(job)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Read more
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No recommended jobs available.</p>
            )}
        </section>
    );
};

RecommendedCards.propTypes = {
    jobs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            company_name: PropTypes.string.isRequired,
            job_skills: PropTypes.arrayOf(PropTypes.string).isRequired,
            matching_skills: PropTypes.arrayOf(PropTypes.string).isRequired,
            location: PropTypes.string.isRequired,
            salary: PropTypes.string,
            type: PropTypes.string.isRequired
        })
    ).isRequired
};

export default RecommendedCards;
