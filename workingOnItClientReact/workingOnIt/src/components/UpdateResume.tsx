
// import React, { useState } from "react";
// import { Button, Typography, Box, Alert, Stack, Paper } from "@mui/material";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DownloadIcon from "@mui/icons-material/Download";
// import { useAuth } from "./AuthContext";
// import axiosInstance from "./axiosInstance";

// const UpdateResume = () => {
//   const { state, dispatch } = useAuth();
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFile(e.target.files?.[0] || null);
//     setError("");
//     setSuccess(false);
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);
//     setError("");
//     setSuccess(false);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", state.user?.id?.toString() || "");
//     formData.append("roleId", state.user?.roleId?.toString() || "");

//     try {
//       const response = await axiosInstance.post("/resume/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // עדכון הסטייט עם הנתיב החדש של הקובץ מהשרת
//       dispatch({ type: "UPDATE_RESUME", payload: { filePath: response.data.fileUrl, fileName: file.name } });

//       // עדכון טוקן אם התקבל
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//       }

//       setSuccess(true);
//       setFile(null);
//     } catch (err) {
//       console.error(err);
//       setError("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!state.resume?.filePath) return;
//     window.open(state.resume.filePath, "_blank");
//   };

//   return (
//     <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 600, margin: "auto", mt: 4 }}>
//       <Typography variant="h5" gutterBottom align="center">
//         Update Your Resume
//       </Typography>

//       <Box sx={{ textAlign: "center", mt: 2 }}>
//         <input
//           accept=".pdf,.doc,.docx"
//           type="file"
//           id="update-resume-upload"
//           style={{ display: "none" }}
//           onChange={handleFileChange}
//         />
//         <label htmlFor="update-resume-upload">
//           <Button variant="outlined" component="span">
//             Choose New Resume File
//           </Button>
//         </label>

//         {file && (
//           <Typography variant="body1" sx={{ mt: 2 }}>
//             Selected file: <strong>{file.name}</strong>
//           </Typography>
//         )}

//         <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<CloudUploadIcon />}
//             onClick={handleUpload}
//             disabled={!file || loading}
//           >
//             {loading ? "Uploading..." : "Upload"}
//           </Button>

//           {state.resume?.filePath && (
//             <Button
//               variant="outlined"
//               color="secondary"
//               startIcon={<DownloadIcon />}
//               onClick={handleDownload}
//             >
//               Download Current Resume
//             </Button>
//           )}
//         </Stack>

//         {success && (
//           <Alert severity="success" sx={{ mt: 3 }}>
//             Resume updated successfully!
//           </Alert>
//         )}

//         {error && (
//           <Alert severity="error" sx={{ mt: 3 }}>
//             {error}
//           </Alert>
//         )}
//       </Box>
//     </Paper>
//   );
// };

// export default UpdateResume;
