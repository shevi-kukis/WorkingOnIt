"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { useAuth } from "./AuthContext"
import axiosInstance from "./axiosInstance"
import axios from "axios"
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Link,
  InputAdornment,
  IconButton,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, QuestionAnswer } from "@mui/icons-material"

const Login = () => {
  const { dispatch } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await axiosInstance.post("/Auth/login", {
        email: formData.email,
        password: formData.password,
      })

      dispatch({
        type: "LOGIN",
        payload: {
          user: response.data.user,
          token: response.data.token,
          resume: response.data.resume || null,
        },
      })

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      if (response.data.resume) {
        localStorage.setItem("resume", JSON.stringify(response.data.resume))
      }

      navigate("/")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const messageFromServer = err.response?.data?.message || "Login failed. Please try again."
        setError(messageFromServer)
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", py: 4 }}
    >
      <Card elevation={3} sx={{ width: "100%" }}>
        <CardHeader sx={{ textAlign: "center", pb: 2 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, mx: "auto", mb: 2 }}>
            <QuestionAnswer sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h4" gutterBottom>
            Sign in to WorkingOnIt
          </Typography>
        </CardHeader>
        <CardContent sx={{ px: 4, pb: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 3, py: 1.5 }}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link component={RouterLink} to="#" variant="body2" color="primary" sx={{ display: "block", mb: 1 }}>
                Forgot password?
              </Link>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register" color="primary">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default Login
