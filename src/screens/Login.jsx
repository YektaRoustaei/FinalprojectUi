const Login = () => {
    return (
        <>
            <section className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Login</h2>
                    <div className="flex flex-col space-y-4">
                        <a
                            href="/loginSeeker"
                            className="w-full py-3 px-5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-200 ease-in-out"
                        >
                            Login as Job Seeker
                        </a>
                        <a
                            href="/loginprovider"
                            className="w-full py-3 px-5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-200 ease-in-out"
                        >
                            Login as Job Provider
                        </a>
                    </div>
                    <div className="text-center mt-6">
                        {/* eslint-disable-next-line react/no-unescaped-entities */}
                        <p className="text-gray-600"> Don't have an account?</p>
                        <a
                            href="/signup"
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
