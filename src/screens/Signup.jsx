const Signup = () => {
    return (
        <>
            <section className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>
                    <div className="flex flex-col space-y-4">
                        <a
                            href="/signupSeeker"
                            className="w-full py-3 px-5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-200 ease-in-out"
                        >
                            Sign Up as Job Seeker
                        </a>
                        <a
                            href="/signupProvider"
                            className="w-full py-3 px-5 text-base font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 transition duration-200 ease-in-out"
                        >
                            Sign Up as Job Provider
                        </a>
                    </div>
                    <div className="text-center mt-6">
                        <p className="text-gray-600">Already have an account?</p>
                        <a
                            href="/login"
                            className="text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out"
                        >
                            Log In
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Signup;
