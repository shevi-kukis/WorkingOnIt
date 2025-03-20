import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";


const EditProfile: React.FC = () => {
  const { state, dispatch } = useAuth();
  const [fullName, setFullName] = useState(state.user?.fullName || "");
  const [email, setEmail] = useState(state.user?.email || "");
  // const [password, setPassword] = useState("");

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
        
         password: state.user?.password
        // password: password || undefined, // לא שולחים אם לא שונה
      
      });

      dispatch({ type: "UPDATE_USER", payload: response.data });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="FullName" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {/* <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password (optional)" /> */}
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default EditProfile;
