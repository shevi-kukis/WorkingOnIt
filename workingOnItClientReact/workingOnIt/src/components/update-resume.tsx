import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';


const UpdateResume = () => {
  const [resume, setResume] = useState(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setResume(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (resume) {
      formData.append('Resume', resume);
    }

    try {
      const userId = useAuth().state.user?.id // Replace with the actual user ID
      const response = await axiosInstance.post(`/Resume/update-resume/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data.message); // אם יש הצלחה
    } catch (error:any) {
      console.error(error.response?.data.message); // אם יש שגיאה
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Update Resume</button>
    </form>
  );
};

export default UpdateResume;
