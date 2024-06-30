const Signup =()=>{
    return <>
        <section className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                <h2 className="text-center text-2xl font-bold mb-6">Add Job</h2>
                <form  className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                            Job Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            className="border rounded w-full py-2 px-3"
                            required


                        >
                            <option value="Full_Time">Full Time</option>
                            <option value="Part_Time">Part Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                            Job Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Job Title"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                            Job Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Job Description"
                            rows={4}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="salary" className="block text-gray-700 font-bold mb-2">
                            Salary
                        </label>
                        <select
                            id="salary"
                            name="salary"
                            className="border rounded w-full py-2 px-3"
                            required

                        >
                            <option value="Under $50K">Under $50K</option>
                            <option value="$50k-$60k">$50k-$60k</option>
                            <option value="$60k-$70k">$60k-$70k</option>
                            <option value="$70k-$80k">$70k-$80k</option>
                            <option value="Over $80k">Over $80k</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="location" className="block text-gray-700 font-bold mb-2">
                            Job Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Job Location"
                        />
                    </div>
                    <h3 className="font-bold">Company Info</h3>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-gray-700 font-bold mb-2">
                            Company Name
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Company Name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="companyDescription" className="block text-gray-700 font-bold mb-2">
                            Company Description
                        </label>
                        <textarea
                            id="companyDescription"
                            name="companyDescription"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Company Description"
                            rows={4}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactEmail" className="block text-gray-700 font-bold mb-2">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="contactEmail"
                            name="contactEmail"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Contact Email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contactPhone" className="block text-gray-700 font-bold mb-2">
                            Contact Phone
                        </label>
                        <input
                            type="tel"
                            id="contactPhone"
                            name="contactPhone"
                            className="border rounded w-full py-2 px-3"

                            placeholder="Contact Phone"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Submit Form
                    </button>
                </form>
            </div>
        </section>
    </>
}
export default Signup