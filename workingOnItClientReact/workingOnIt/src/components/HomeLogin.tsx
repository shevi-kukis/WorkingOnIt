// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Grid,
//   InputAdornment,
//   IconButton,
//   Alert,
//   useTheme,
// } from "@mui/material"
// import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
// import { useAuth } from "./AuthContext"

// const HomeLogin = () => {
//   const { login } = useAuth()
//   const navigate = useNavigate()
//   const theme = useTheme()

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const [showPassword, setShowPassword] = useState(false)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setLoading(true)

//     try {
//       // Keep existing login logic
//       await login(formData.email, formData.password)
//       navigate("/")
//     } catch (err) {
//       setError("Invalid email or password. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Paper
//         elevation={2}
//         sx={{
//           p: 4,
//           borderRadius: 2,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Box sx={{ mb: 3, textAlign: "center" }}>
//           <img src="/logo.svg" alt="WorkingOnIt Logo" style={{ height: 60, marginBottom: 16 }} />
//           <Typography component="h1" variant="h5" color="primary" fontWeight={500}>
//             Welcome Back
//           </Typography>
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="email"
//             label="Email Address"
//             name="email"
//             autoComplete="email"
//             autoFocus
//             value={formData.email}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Email color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type={showPassword ? "text" : "password"}
//             id="password"
//             autoComplete="current-password"
//             value={formData.password}
//             onChange={handleChange}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Lock color="action" />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} disabled={loading}>
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//           <Grid container>
//             <Grid item xs>
//               <Button color="primary" size="small" onClick={() => navigate("/register")}>
//                 Create Account
//               </Button>
//             </Grid>
//             <Grid item>
//               <Button color="primary" size="small">
//                 Forgot Password?
//               </Button>
//             </Grid>
//           </Grid>
//         </Box>
//       </Paper>
//     </Container>
//   )
// }

// export default HomeLogin
