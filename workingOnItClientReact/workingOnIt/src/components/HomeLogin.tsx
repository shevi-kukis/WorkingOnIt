import { Avatar } from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import UpdateResume from "./update-resume";



import FileUploader from "./FileUploader";


const HomeLogin = () => {
  const { state, dispatch } = useAuth();
  // const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  {console.log(state)}
  const logOut = () => {
    dispatch({ type: "LOGOUT" });
    navigate('/Home');
  };
  
  return (
    
    <nav>
    
      {state.user ? (
        <>
          <span>Welcome, {state.user.fullName}!</span>
          <Avatar sx={{ bgcolor: "blue", color: "white" }}>
            {state.user.fullName[0]}
          </Avatar>
          <button onClick={logOut}>Logout</button> 

          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>

          {state.resume ? (
        
          <FileUploader fileName={state.resume.fileName} contentType={state.resume.filePath} />
        //   <a href={state.resume.filePath} target="_blank" rel="noopener noreferrer">
        //   Download Resume
        // </a>
          ) : (
            <span>No resume uploaded</span>
          )}

          <UpdateResume />
        </>
      ) : (
        <span>Please log in</span>
      )}
    </nav>
  );
};

export default HomeLogin;
