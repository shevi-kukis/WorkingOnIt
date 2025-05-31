"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Alert,
  Box,
  Paper,
  Avatar,
  useTheme,
  CircularProgress,
  Backdrop,
} from "@mui/material"
import { CloudUpload, Download, Description, CheckCircle } from "@mui/icons-material"

const UpLoadResume = () => {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { state, dispatch } = useAuth()
  const theme = useTheme()

  const resumeExists = Boolean(state.resume?.filePath)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
    setError("")
    setSuccess(false)
  }

  const handleUploadOrUpdate = async () => {
    if (!file) return
    setLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("userId", state.user?.id?.toString() || "")
    formData.append("roleId", state.user?.roleId?.toString() || "")

    try {
      const response = await axiosInstance.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      dispatch({
        type: "UPDATE_RESUME",
        payload: { filePath: response.data.fileUrl, fileName: file.name },
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      setSuccess(true)
      setFile(null)
    } catch (err) {
      console.error("Upload failed", err)
      setError("Upload failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!state.resume?.filePath) return
    window.open(state.resume.filePath, "_blank")
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress color="inherit" />
          <Typography>Uploading your resume...</Typography>
        </Box>
      </Backdrop>

      <Card elevation={2}>
        <CardHeader sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, mx: "auto", mb: 2 }}>
            <Description sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            {resumeExists ? "Update Your Resume" : "Upload Resume"}
          </Typography>
        </CardHeader>
        <CardContent sx={{ px: 4, pb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                border: `2px dashed ${theme.palette.divider}`,
                borderRadius: 2,
                p: 6,
                textAlign: "center",
                bgcolor: "background.default",
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                },
              }}
              component="label"
            >
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
              <CloudUpload sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Click to upload or drag and drop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                PDF, DOC, DOCX files supported
              </Typography>
            </Paper>

            {file && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Description />
                  <Typography>
                    Selected file: <strong>{file.name}</strong>
                  </Typography>
                </Box>
              </Alert>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
              onClick={handleUploadOrUpdate}
              disabled={!file || loading}
              size="large"
            >
              {loading ? "Uploading..." : resumeExists ? "Update" : "Upload"}
            </Button>

            {resumeExists && (
              <Button variant="outlined" startIcon={<Download />} onClick={handleDownload} size="large">
                Download Current Resume
              </Button>
            )}
          </Box>

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle />
                <Typography>Resume {resumeExists ? "updated" : "uploaded"} successfully!</Typography>
              </Box>
            </Alert>
          )}

          {error && (
            <Alert severity="error">
              <Typography>{error}</Typography>
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  )
}

export default UpLoadResume
