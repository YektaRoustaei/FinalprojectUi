import HomePage from "./screens/HomePage.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';
import Signup from "./screens/Signup.jsx";
import JobCard from "./components/JobCard.jsx";
import JobsList from "./components/JobsList.jsx";
import SeekerSignUp from "./components/SeekerSignUp.jsx";
import ProviderSignUp from "./components/ProviderSignUp.jsx";


const App = () => {
const router = createBrowserRouter(
        createRoutesFromElements(
      <Route path='/' element={<MainLayout/>}>

          <Route index element={<HomePage/>}/>
          <Route path='/jobslist' element={<JobsList/>}/>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signupSeeker' element={<SeekerSignUp />} />
          <Route path='/signupProvider' element={<ProviderSignUp />} />

      </Route>
        ))

  return (<RouterProvider router={router} />);}

export default App;
