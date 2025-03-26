import React, { useState } from "react";
import { Button } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import UpdateResume from "./UpdateResume";

import DownLoadResume from "./DownLaodResume";

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { state, dispatch } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch({
        type: "UPDATE_RESUME",
        payload: response.data,
      });

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("File upload failed", error);
    }
  };

  return (
    <div>

      <input type="file" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} disabled={!file}>
        העלה קובץ
      </Button>
      <UpdateResume />
    </div>
  );
};

export default UploadResume;
