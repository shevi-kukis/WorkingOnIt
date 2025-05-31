"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Avatar,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person, QuestionAnswer } from "@mui/icons-material"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"
import axios from "axios"

const Register = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("Please fill in all required fields")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address")
        return
      }
    } else if (activeStep === 1) {
      // Validate second step
      if (!formData.password || !formData.confirmPassword) {
        setError("Please fill in all required fields")
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
    }

    setError("")
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axiosInstance.post("/Auth/register", {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
      })

      dispatch({
        type: "REGISTER",
        payload: {
          user: response.data.user,
          token: response.data.token,
          resume: response.data.resume || null,
        },
      })
      localStorage.setItem("token", response.data.token)

      navigate("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const messageFromServer = err.response?.data?.message || "Registration failed. Please try again."
        setError(messageFromServer)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const steps = ["Account Information", "Security"]

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card elevation={3} sx={{ width: "100%" }}>
          <CardHeader sx={{ textAlign: "center", pb: 2 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, mx: "auto", mb: 2 }}>
              <QuestionAnswer sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h4" gutterBottom>
              Create Your Account
            </Typography>
          </CardHeader>
          <CardContent sx={{ px: 4, pb: 4 }}>
            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {error}
              </Alert>
            )}

            <Stepper activeStep={activeStep} sx={{ width: "100%", mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
              {activeStep === 0 && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        value={formData.firstName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                  Back
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  ) : (
                    <Button variant="contained" color="primary" onClick={handleNext}>
                      Next
                    </Button>
                  )}
                </Box>
              </Box>

              <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2" color="primary">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default Register
