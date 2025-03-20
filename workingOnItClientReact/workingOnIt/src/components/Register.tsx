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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setResume(file);
  };
const handleClose=()=>
{
  setOpen(false)
  navigate("/home");
}
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", username);
    formData.append("email", email);
    formData.append("passwordHash", password);
    if (resume) {
      formData.append("resume", resume);
    }

    try {
      const response = await axiosInstance.post("/Auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch({
        type: "REGISTER",
        payload: {
          user: response.data.user,
          token: response.data.token,
          resume: response.data.resume || null,
        },
      });

      setOpen(false); // סגירת המודל לאחר רישום
      navigate("/homeLogin");
    } catch (error: any) {
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
          <input type="file" onChange={handleFileChange} />

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
