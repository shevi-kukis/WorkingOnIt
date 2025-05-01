"use client"

import React from "react"

import { useState } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material"
import DescriptionIcon from "@mui/icons-material/Description"
import GetAppIcon from "@mui/icons-material/GetApp"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import { useAuth } from "./AuthContext"

const DownLoadResume = () => {
  const { state } = useAuth()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const resumeFormats = [
    { id: "pdf", name: "PDF Format", icon: <PictureAsPdfIcon />, extension: ".pdf" },
    { id: "docx", name: "Word Document", icon: <InsertDriveFileIcon />, extension: ".docx" },
    { id: "txt", name: "Plain Text", icon: <DescriptionIcon />, extension: ".txt" },
  ]

  const handleDownload = (format: string) => {
    setLoading(true)
    setError("")
    setSuccess(false)

    // Simulate download process
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to generate and download the resume
        console.log(`Downloading resume in ${format} format`)

        // Create a fake download link
        const link = document.createElement("a")
        link.href = "#"
        link.download = `resume_${state.user?.fullName}${
          resumeFormats.find((f) => f.id === format)?.extension || ""
        }`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } catch (err) {
        setError("Failed to download resume. Please try again.")
      } finally {
        setLoading(false)
      }
    }, 1500)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Download Your Resume
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Download your resume in various formats for your job applications.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Resume downloaded successfully!
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {resumeFormats.map((format, index) => (
              <React.Fragment key={format.id}>
                <ListItem>
                  <ListItemIcon sx={{ color: theme.palette.primary.main }}>{format.icon}</ListItemIcon>
                  <ListItemText primary={format.name} secondary={`Download your resume as a ${format.name}`} />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GetAppIcon />}
                    onClick={() => handleDownload(format.id)}
                  >
                    Download
                  </Button>
                </ListItem>
                {index < resumeFormats.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Need to update your resume before downloading?
          </Typography>
          <Button variant="outlined" color="primary" href="/update-resume">
            Update Resume
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default DownLoadResume
