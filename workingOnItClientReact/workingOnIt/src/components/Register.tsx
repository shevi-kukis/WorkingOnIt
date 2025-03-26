import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterModal: React.FC = () => {
  const [open, setOpen] = useState(true); // המודל נפתח אוטומטית
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const { dispatch } = useAuth();
  const navigate = useNavigate();

const handleClose=()=>
{
  setOpen(false)
  navigate("/home");
}
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await axiosInstance.post("/Auth/register", {
      fullName: username,
      email,
      password,
    });

    dispatch({
      type: "REGISTER",
      payload: {
        user: response.data.user,
        token: response.data.token, // הטוקן יתקבל בהתחברות
        resume: null,
      },
    });

    setOpen(false);
    navigate("/homeLogin");
  } catch (error) {
    console.error("Registration failed", error);
  }
};


  return (
    <Dialog open={open} onClose={ handleClose}>
      <DialogTitle>הרשמה</DialogTitle>
      <DialogContent>
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Full Name"
            margin="dense"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="dense"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
      

          <DialogActions>
            <Button onClick={handleClose}>ביטול</Button>
            <Button type="submit" variant="contained">
              הרשמה
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
