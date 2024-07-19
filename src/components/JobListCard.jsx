import PropTypes from "prop-types";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faSackDollar, faLocationDot, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const JobListCard = ({ job, companyName, address, isRecommended }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/jobslist/job/${job.id}`, { state: { job, companyName, address } });
    };

    // Ensure salary is a number before formatting
    const formattedSalary = typeof job.salary === 'number' ? job.salary.toLocaleString() : 'N/A';

    return (
        <div
            className="cursor-pointer w-full p-6 bg-white border border-gray-300 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4 transform transition duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-800"
            onClick={handleCardClick}
        >
            <div className="mb-4">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{job.title}</h5>
                <p className="text-sm text-gray-500 dark:text-gray-400">Posted by <span className="font-semibold text-gray-700 dark:text-white">{companyName}</span></p>
            </div>
            <div className="space-y-2">
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faBuilding} className="mr-2"/>
                    <span>{companyName}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faSackDollar} className="mr-2"/>
                    <span>${formattedSalary}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-2"/>
                    <span>{job.type}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-2"/>
                    <span>{address}</span>
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-400 line-clamp-2">
                    <span>{job.description}</span>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap">
                {job.jobskills && job.jobskills.length > 0 && job.jobskills.map((jobSkill) => (
                    <span key={jobSkill.skill.id} className={`inline-block text-sm px-2 py-1 rounded-full mr-2 mb-2 ${isRecommended ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                        {jobSkill.skill.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 text-right">
                <button
                    onClick={handleCardClick}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Read more
                </button>
            </div>
        </div>
    );
}

JobListCard.propTypes = {
    job: PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        salary: PropTypes.number.isRequired, // Changed to number for better handling
        description: PropTypes.string.isRequired,
        location: PropTypes.string,
        provider_id: PropTypes.number.isRequired,
        jobskills: PropTypes.arrayOf(PropTypes.shape({
            skill: PropTypes.shape({
                id: PropTypes.number.isRequired,
                name: PropTypes.string.isRequired
            }).isRequired
        })).isRequired
    }).isRequired,
    companyName: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    isRecommended: PropTypes.bool
};

export default JobListCard;
