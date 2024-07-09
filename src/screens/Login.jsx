
const Login = () => {

    return (
        <>
            <section className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 my-5">
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-8">Login</h2>
                    <div className="flex flex-col md:flex-row justify-around items-center mb-6">
                        <div className="mb-4 md:mb-0">
                            <a
                                href='/loginSeeker'
                                className="border border-gray-300 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 hover:text-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                Login as Job Seeker
                            </a>
                        </div>
                        <div>
                            <a
                                href='/loginprovider'
                                className="border border-gray-300 inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 hover:text-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900 hover:bg-gray-100  dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                            >
                                Login as Job Provider
                            </a>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600">Do not have an account?</p>
                        <a
                            href='/signup'
                            className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                        >
                           Sign Up
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;
