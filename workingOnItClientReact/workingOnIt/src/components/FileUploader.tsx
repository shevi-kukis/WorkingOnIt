"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Box, Typography, Paper, LinearProgress, IconButton, useTheme } from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"

interface FileUploaderProps {
  onFileSelect: (file: File) => void
  acceptedFileTypes?: string
  maxFileSizeMB?: number
  label?: string
}

const FileUploader = ({
  onFileSelect,
  acceptedFileTypes = ".pdf,.doc,.docx",
  maxFileSizeMB = 5,
  label = "Upload File",
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string>("")
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const fileSizeMB = file.size / (1024 * 1024)

    if (fileSizeMB > maxFileSizeMB) {
      setError(`File size exceeds the maximum limit of ${maxFileSizeMB}MB.`)
      return
    }

    setError("")
    setSelectedFile(file)
    onFileSelect(file)

    // Simulate upload progress
    simulateUpload()
  }

  const simulateUpload = () => {
    setUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setUploading(false)
          }, 500)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (!files || files.length === 0) return

    const file = files[0]
    const fileSizeMB = file.size / (1024 * 1024)

    if (fileSizeMB > maxFileSizeMB) {
      setError(`File size exceeds the maximum limit of ${maxFileSizeMB}MB.`)
      return
    }

    setError("")
    setSelectedFile(file)
    onFileSelect(file)

    // Simulate upload progress
    simulateUpload()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <Box sx={{ width: "100%" }}>
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      {!selectedFile ? (
        <Paper
          elevation={0}
          sx={{
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            bgcolor: "rgba(0, 188, 212, 0.05)",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(0, 188, 212, 0.1)",
            },
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
          <Typography variant="h6" color="primary" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your file here, or click to browse
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Accepted file types: {acceptedFileTypes.replace(/\./g, "").replace(/,/g, ", ")}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Maximum file size: {maxFileSizeMB}MB
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: uploading ? 1 : 0 }}>
            <InsertDriveFileIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="body1" sx={{ flexGrow: 1, mr: 2 }} noWrap>
              {selectedFile.name}
            </Typography>
            {!uploading && (
              <>
                <CheckCircleIcon sx={{ color: "success.main", mr: 1 }} />
                <IconButton size="small" onClick={handleRemoveFile} color="error">
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
          {uploading && (
            <Box sx={{ width: "100%", mt: 1 }}>
              <LinearProgress variant="determinate" value={uploadProgress} color="primary" />
              <Typography variant="caption" sx={{ display: "block", mt: 0.5, textAlign: "right" }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default FileUploader
