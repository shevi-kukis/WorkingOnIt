import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Alert,
  Box,
  Paper,
  Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { useAuth } from "./AuthContext";
import axiosInstance from "./axiosInstance";

const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useAuth();
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError("");
  };


  // const handleUpload = async () => {
  //   if (!file) return;
  //   setLoading(true);
  //   setError("");
  
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("roleId", state.user?.roleId?.toString() || "");
  //   formData.append("userId", state.user?.id?.toString() || "");
    
  
  //   try {
  //     const response = await axiosInstance.post("/resume/upload", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     console.log("response.data", response.data);
  //     console.log("Resume uploaded successfully:", response.data.resume.filePath);
  
     
  //     dispatch({ type: "UPDATE_RESUME", payload: response. data.resume }); // ✅ עדכון סטייט

  
 
  //     localStorage.setItem("token", response.data.resume); // ✅ שימוש ב-token העדכני
  
  //     setUploadSuccess(true);
  //     setError("");
  //     setFile(null);
  //   } catch (err) {
  //     console.error("Upload failed", err);
  //     setError("Upload failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("roleId", state.user?.roleId?.toString() || "");
    formData.append("userId", state.user?.id?.toString() || "");
    try {
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("response.data", response.data);
      console.log("Resume uploaded successfully:", response.data.fileUrl);
  
      // שמירת הטוקן החדש
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
  
      // אם אתה רוצה לעדכן את סטייט המשתמש עם הנתיב של קובץ קורות החיים:
      dispatch({ type: "UPDATE_RESUME", payload: { filePath: response.data.fileUrl } });
  
      setUploadSuccess(true);
      setError("");
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDownload = () => {
    if (!state.resume?.filePath) return;
    window.open(state.resume.filePath, "_blank");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Upload Your Resume
        </Typography>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <input
            accept=".pdf,.doc,.docx"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button variant="outlined" component="span">
              Choose File
            </Button>
          </label>

          {file && (
            <Typography sx={{ mt: 2 }} variant="body1">
              Selected file: <strong>{file.name}</strong>
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>

            {(uploadSuccess||state.resume?.filePath ) && (
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
              >
                Download Current Resume
              </Button>
            )}
          </Stack>

          {uploadSuccess || state.resume?.filePath  && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Resume uploaded successfully!
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default UploadResume;
