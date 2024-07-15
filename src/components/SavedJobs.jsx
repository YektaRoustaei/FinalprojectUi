import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const SavedJobs = ({ savedJobs }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-8">Saved Jobs</h1>
                {savedJobs && savedJobs.length > 0 ? (
                    <div>
                        {savedJobs.map(job => (
                            <div key={job.id} className="border border-gray-200 rounded-lg p-4 text-center hover:border-gray-400 hover:shadow-xl mb-4">
                                <p className="text-lg font-semibold mb-2">{job.title}</p>
                                <p className="text-gray-700">{job.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600">No saved jobs available.</div>
                )}
                <button
                    onClick={() => navigate('/seekerdashboard')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

SavedJobs.propTypes = {
    savedJobs: PropTypes.array.isRequired,
};

export default SavedJobs;
