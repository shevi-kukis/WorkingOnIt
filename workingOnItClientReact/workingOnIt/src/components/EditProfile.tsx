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
  Card,
  CardContent,
  CardHeader,
  Grid,
  Avatar,
  IconButton,
  Divider,
  Alert,
  useTheme,
  CircularProgress,
  Backdrop,
} from "@mui/material"
import { PhotoCamera, Save, ArrowBack, Person } from "@mui/icons-material"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"

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
    setLoading(true)

    try {
      const response = await axiosInstance.put(`/User/update/${state.user?.id}`, {
        fullName: formData.fullName,
        email: formData.email,
        password: state.user?.password,
      })
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
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress color="inherit" />
          <Typography>Updating profile...</Typography>
        </Box>
      </Backdrop>

      <Card elevation={2}>
        <CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton color="primary" aria-label="back" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" color="primary">
              Edit Profile
            </Typography>
          </Box>
        </CardHeader>
        <CardContent sx={{ px: 4, pb: 4 }}>
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
                  {formData.fullName.charAt(0) || <Person sx={{ fontSize: "3rem" }} />}
                </Avatar>
                <Box sx={{ position: "relative" }}>
                  <input accept="image/*" style={{ display: "none" }} id="icon-button-file" type="file" />
                  <label htmlFor="icon-button-file">
                    <Button variant="outlined" component="span" startIcon={<PhotoCamera />} sx={{ mt: 1 }}>
                      Change Photo
                    </Button>
                  </label>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      size="medium"
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
                      size="medium"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
              <Button variant="outlined" color="primary" onClick={() => navigate("/uploadResume")} size="large">
                Update Resume
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Save />}
                disabled={loading}
                size="large"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default EditProfile
