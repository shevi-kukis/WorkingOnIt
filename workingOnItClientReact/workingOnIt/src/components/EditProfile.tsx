"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  useTheme,
} from "@mui/material"
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera"
import SaveIcon from "@mui/icons-material/Save"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"
// Remove incorrect import
// import { Update } from "@mui/icons-material"

// Define or import the correct Update action


const EditProfile = () => {
  const { state, dispatch } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [formData, setFormData] = useState({
    fullName: state.user?.fullName || "",
   
    email: state.user?.email || "",

  })

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    setSuccess(false)
  
    try {
      // Keep existing update logic
      const response = await axiosInstance.put(`/User/update/${state.user?.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        password: state.user?.password,
      });
      dispatch({ type: "UPDATE_USER", payload: { ...formData } })
  
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <IconButton color="primary" aria-label="back" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" color="primary">
            Edit Profile
          </Typography>
        </Box>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: theme.palette.primary.main,
                  fontSize: "3rem",
                  mb: 2,
                }}
              >
                {formData.fullName.charAt(0)}
         
              </Avatar>
              <Box sx={{ position: "relative" }}>
                <input accept="image/*" style={{ display: "none" }} id="icon-button-file" type="file" />
                <label htmlFor="icon-button-file">
                  <Button variant="outlined" component="span" startIcon={<PhotoCameraIcon />} sx={{ mt: 1 }}>
                    Change Photo
                  </Button>
                </label>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
             
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    helperText="Email cannot be changed"
                  />
                </Grid>
              
               
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" color="primary" onClick={() => navigate("/update-resume")}>
              Update Resume
            </Button>
            <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default EditProfile


