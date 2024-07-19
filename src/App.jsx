import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import MainLayout from "./layout/MainLayout.jsx";
import HomePage from "./screens/HomePage.jsx";
import JobsList from "./components/JobsList.jsx";
import Signup from "./screens/Signup.jsx";
import SeekerSignUp from "./components/SeekerSignUp.jsx";
import ProviderSignUp from "./components/ProviderSignUp.jsx";
import Login from "./screens/Login.jsx";
import LoginProvider from "./components/LoginProvider.jsx";
import LoginSeeker from "./components/LoginSeeker.jsx";
import ProviderDashboard from "./screens/ProviderDashboard.jsx";
import SeekerDashboard from "./screens/SeekerDashboard.jsx";
import AddJob from "./screens/AddJob.jsx";
import ProviderProtectedRoute from './Tokens/ProviderProtectedRoute.jsx';
import SeekerProtectedRoute from './Tokens/SeekerProtectedRoute.jsx';
import AdminProtectedRoute from "./Tokens/AdminProtectedRoute.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AdminLogin from "./Admin/AdminLogin.jsx";
import JobDetails from "./components/JobDetails.jsx";
import CreatedJobs from "./components/CreatedJobs.jsx";
import AppliedJobs from "./components/AppliedJobs.jsx";
import SavedJobs from "./components/SavedJobs.jsx";
import CV from "./screens/CV.jsx";
import CVList from "./components/CVList.jsx";
import RecommendDetail from "./components/RecommendDetail.jsx";

const App = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<MainLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path='/jobslist' element={<JobsList/>}/>
                <Route path='/admin/login' element={<AdminLogin/>}/>
                <Route path='/signup' element={<Signup />} />
                <Route path='/signupSeeker' element={<SeekerSignUp />} />
                <Route path='/signupProvider' element={<ProviderSignUp />} />
                <Route path='/login' element={<Login />} />
                <Route path='/loginprovider' element={<LoginProvider />} />
                <Route path='/loginseeker' element={<LoginSeeker/>} />
                <Route path='/provider-dashboard' element={
                    <ProviderProtectedRoute>
                        <ProviderDashboard/>
                    </ProviderProtectedRoute>
                } />
                <Route path='/provider-dashboard/jobs' element={
                    <ProviderProtectedRoute>
                        <CreatedJobs/>
                    </ProviderProtectedRoute>
                } />
                <Route path='/admin' element={
                    <AdminProtectedRoute>
                        <AdminDashboard/>
                    </AdminProtectedRoute>
                } />
                <Route path="/add-job" element={
                    <ProviderProtectedRoute>
                        <AddJob />
                    </ProviderProtectedRoute>
                } />
                <Route path="jobslist/job/:id" element={
                    <SeekerProtectedRoute>
                        <JobDetails/>
                    </SeekerProtectedRoute>
                } />
                <Route path="jobslist/recommendjob/:id" element={
                    <SeekerProtectedRoute>
                        {/* eslint-disable-next-line react/jsx-no-undef */}
                        <RecommendDetail/>
                    </SeekerProtectedRoute>
                } />
                <Route path="/seeker-dashboard/appliedjobs" element={
                    <SeekerProtectedRoute>
                        <AppliedJobs/>
                    </SeekerProtectedRoute>
                } />
                <Route path="/seeker-dashboard/cvList" element={
                    <SeekerProtectedRoute>
                        <CVList/>
                    </SeekerProtectedRoute>
                } />
                <Route path="/seeker-dashboard/savedjobs" element={
                    <SeekerProtectedRoute>
                        <SavedJobs/>
                    </SeekerProtectedRoute>
                } />
                <Route path="/seeker/cv" element={
                    <SeekerProtectedRoute>
                        <CV/>
                    </SeekerProtectedRoute>
                } />
                <Route path='/seeker-dashboard' element={
                    <SeekerProtectedRoute>
                        <SeekerDashboard/>
                    </SeekerProtectedRoute>
                } />
            </Route>
        )
    )

    return <>
        <RouterProvider router={router} />
        <ToastContainer />
    </>
}

export default App;
