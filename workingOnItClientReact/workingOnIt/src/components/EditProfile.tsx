import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const EditProfile: React.FC = () => {
  const { state, dispatch } = useAuth();
  const [fullName, setFullName] = useState(state.user?.fullName || "");
  const [email, setEmail] = useState(state.user?.email || "");
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (state.user) {
      setFullName(state.user.fullName);
      setEmail(state.user.email);
    }
  }, [state.user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(`/User/update/${state.user?.id}`, {
        fullName,
        email,
        password: state.user?.password,
      });

      dispatch({ type: "UPDATE_USER", payload: response.data });
      alert("Profile updated successfully!");
      setOpen(false);
      navigate("/homeLogin");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogContent>
        <form onSubmit={handleUpdate}>
          <TextField 
            fullWidth 
            label="Full Name" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            margin="dense"
          />
          <TextField 
            fullWidth 
            label="Email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            margin="dense"
          />
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Update Profile</Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
