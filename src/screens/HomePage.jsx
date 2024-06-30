import Hero from '../components/Hero.jsx';
import JobCard from "../components/JobCard.jsx";

const HomePage = () => {
    return (
        <>
            <Hero />
            <div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg my-4">
                <span className="font-semibold text-gray-400 uppercase">Popular Jobs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                    {Array(3).fill().map((_, index) => (
                        <a key={index} href="#" className="hover:text-gray-800 dark:hover:text-gray-400">
                            <JobCard />
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};

export default HomePage;
