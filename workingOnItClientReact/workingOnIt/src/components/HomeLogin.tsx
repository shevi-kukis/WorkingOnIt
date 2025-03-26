import { Avatar } from "@mui/material";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";




import FileUploader from "./FileUploader";
import DownLoadResume from "./DownLaodResume";


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
        <div>aaaa</div>
        <div>{state.resume?.filePath}</div>
    
          <span>Welcome, {state.user.fullName}!</span>
          <Avatar sx={{ bgcolor: "blue", color: "white" }}>
            {state.user.fullName[0]}
          </Avatar>
          <button onClick={logOut}>Logout</button> 

          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>

          {state.resume ? (
      <DownLoadResume/>
        
          // <FileUploader resumeUrl={state.resume.filePath} />
        //   <a href={state.resume.filePath} target="_blank" rel="noopener noreferrer">
        //   Download Resume
        // </a>
          ) : (
            <span>No resume uploaded</span>
          )}

       
        </>
      ) : (
        <span>Please log in</span>
      )}
    </nav>
  );
};

export default HomeLogin;
