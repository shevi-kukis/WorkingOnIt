import { Outlet, useNavigate } from "react-router"
import NavBar from "./NavBar"
import { useEffect } from "react";
import Login from "./Login";


const AppLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/Home"); 
    }, [navigate]);

    return (<>
       
        <NavBar />
        <Outlet />
     
    </>)
}

export default AppLayout


