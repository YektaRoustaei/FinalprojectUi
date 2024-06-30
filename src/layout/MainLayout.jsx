import Navbar from "../components/Navbar.jsx";
import {Outlet} from 'react-router-dom';
import Footer from "../components/Footer.jsx";

const MainLayout =()=>{
    return(
        <>
        <Navbar/>
        <Outlet className="flex-grow" />
        <Footer/>
    </>
    )
}
export default MainLayout