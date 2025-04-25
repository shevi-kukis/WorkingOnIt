import React, { useEffect, useState } from "react"
import {
  Container,
  Typography,
  Button,
  Alert,
  Box,
  Paper,
  Stack,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DownloadIcon from "@mui/icons-material/Download"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"



const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { state, dispatch } = useAuth()
  const existingResume = state.resume?.filePath

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError("")
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Uploaded resume:", response.data);
      const result = response.data
      // if (result.success) {
      //   dispatch({ type: "UPDATE_RESUME", payload: result.data })
      //   setFile(null)
      // } else {
      //   setError("Upload failed. Please try again1.")
      // }

    } catch (err) {
      setError("Upload failed. Please try again2.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!existingResume) return
    window.open(existingResume, "_blank")
  }

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

            {existingResume && (
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
     

          {state.resume && (
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

      {/* <UpdateResume /> */}
    </Container>
  )
}

export default UploadResume


