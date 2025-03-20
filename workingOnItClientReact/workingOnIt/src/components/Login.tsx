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

const LoginModal: React.FC = () => {
  const [open, setOpen] = useState(true); // המודל נפתח אוטומטית
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/Auth/login", { email, password });
      dispatch({
        type: "LOGIN",
        payload: {
          user: response.data.user,
          token: response.data.token,
          resume: response.data.resume || null,
        },
      });
      localStorage.setItem("token", response.data.token);
      setOpen(false); // סגירת המודל לאחר התחברות
      navigate("/homeLogin");
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };
  const handleClose=()=>
    {
      setOpen(false)
      navigate("/home");
    }
  return (
    <Dialog open={open} onClose={ handleClose}>
      <DialogTitle>התחברות</DialogTitle>
      <DialogContent>
        <form onSubmit={handleLogin}>
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
              התחבר
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
