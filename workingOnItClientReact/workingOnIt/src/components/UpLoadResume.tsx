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

const UpLoadResume = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { state, dispatch } = useAuth();

  const resumeExists = Boolean(state.resume?.filePath);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
    setSuccess(false);
  };

  const handleUploadOrUpdate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", state.user?.id?.toString() || "");
    formData.append("roleId", state.user?.roleId?.toString() || "");

    try {
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch({
        type: "UPDATE_RESUME",
        payload: { filePath: response.data.fileUrl, fileName: file.name },
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      setSuccess(true);
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
        <Typography variant="h5" gutterBottom align="center">
          {resumeExists ? "Update Your Resume" : "Upload Your Resume"}
        </Typography>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <input
            accept=".pdf,.doc,.docx"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="resume-file-input"
          />
          <label htmlFor="resume-file-input">
            <Button variant="outlined" component="span">
              {resumeExists ? "Choose New File" : "Choose File"}
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
              onClick={handleUploadOrUpdate}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : resumeExists ? "Update" : "Upload"}
            </Button>

            {resumeExists && (
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

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Resume {resumeExists ? "updated" : "uploaded"} successfully!
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

export default UpLoadResume;
