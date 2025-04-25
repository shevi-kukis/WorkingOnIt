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
//   Divider,
//   Chip,
//   IconButton,
//   Alert,
//   useTheme,
// } from "@mui/material"
// import AddIcon from "@mui/icons-material/Add"
// import DeleteIcon from "@mui/icons-material/Delete"
// import SaveIcon from "@mui/icons-material/Save"
// import ArrowBackIcon from "@mui/icons-material/ArrowBack"
// import FileUploader from "./FileUploader"
// import { useAuth } from "./AuthContext"

// const UpdateResume = () => {
//   const { state, dispatch } = useAuth()
//   const navigate = useNavigate()
//   const theme = useTheme()

//   const [resumeData, setResumeData] = useState({
  
//   })




//   const [success, setSuccess] = useState(false)
//   const [error, setError] = useState("")
//   const [loading, setLoading] = useState(false)

//   const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
   
//   }

//   const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
  
//   }

//   const handleAddEducation = () => {
   

//     setResumeData((prev) => ({
//       ...prev,

//     }))

    
//   }

//   const handleAddExperience = () => {
//     if (!newExperience.company || !newExperience.position) return

//     setResumeData((prev) => ({
//       ...prev,
//       experience: [...prev.experience, newExperience],
//     }))

//     setNewExperience({
//       company: "",
//       position: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//     })
//   }

//   const handleAddSkill = () => {
//     if (!newSkill.trim()) return

//     setResumeData((prev) => ({
//       ...prev,
//       skills: [...prev.skills, newSkill],
//     }))

//     setNewSkill("")
//   }

//   const handleRemoveEducation = (index: number) => {
//     setResumeData((prev) => ({
//       ...prev,
//       education: prev.education.filter((_, i) => i !== index),
//     }))
//   }

//   const handleRemoveExperience = (index: number) => {
//     setResumeData((prev) => ({
//       ...prev,
//       experience: prev.experience.filter((_, i) => i !== index),
//     }))
//   }

//   const handleRemoveSkill = (index: number) => {
//     setResumeData((prev) => ({
//       ...prev,
//       skills: prev.skills.filter((_: any, i: number) => i !== index),
//     }))
//   }

//   const handleFileSelect = (file: File) => {
//     // Handle file upload logic
//     console.log("File selected:", file)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setSuccess(false)
//     setLoading(true)

//     try {
//       // Keep existing update logic
//       await updateResume(resumeData)
//       setSuccess(true)
//       setTimeout(() => {
//         setSuccess(false)
//       }, 3000)
//     } catch (err) {
//       setError("Failed to update resume. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Container maxWidth="md" sx={{ py: 4 }}>
//       <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
//         <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
//           <IconButton color="primary" aria-label="back" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
//             <ArrowBackIcon />
//           </IconButton>
//           <Typography variant="h4" component="h1" color="primary">
//             Update Resume
//           </Typography>
//         </Box>

//         {success && (
//           <Alert severity="success" sx={{ mb: 3 }}>
//             Resume updated successfully!
//           </Alert>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

      
//       </Paper>
//     </Container>
//   )
// }

// export default UpdateResume
