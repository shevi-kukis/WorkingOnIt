import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const NavBar = () => {
    return (
        <AppBar position="fixed" sx={{ bgcolor: "error.main", top: 0, left: 0, width: "100%", zIndex: 1100 }}>
            <Toolbar sx={{ justifyContent: "flex-end" }}>
                <Link to={"/Home"}>
                    <Button sx={{ color: "white" }}>🏠 Home</Button> 
                </Link>
                <Link to={"/signIn"}>
                    <Button sx={{ color: "white" }}>ℹsignIn</Button> 
                </Link>
                <Link to={"/signUp"}>
                    <Button sx={{ color: "white" }}> 📖 signUp</Button> 
                </Link>
                <Link to={"/interviewTips"}>
                    <Button sx={{ color: "white" }}> 📖 tips for interview</Button> 
                </Link>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;