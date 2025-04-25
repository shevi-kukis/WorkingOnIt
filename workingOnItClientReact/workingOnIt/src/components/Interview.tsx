// "use client"

// import React, { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import {
//   Container,
//   Box,
//   Typography,
//   Button,
//   Paper,
//   Grid,
//   CircularProgress,
//   Chip,
//   Card,
//   CardContent,
//   Divider,
// } from "@mui/material"
// import { useTheme } from "@mui/material/styles"
// import { useAuth } from "./AuthContext"
// import {
//   checkAnswer,
//   nextQuestion,
//   addFeedback,
//   uploadResume,
//   evaluateResponses,
// } from "../store/interviewSlice"
// import { StoreType } from "../store/store"
// import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
// const InterviewReduxStyled = () => {
//   const dispatch = useDispatch()
//   const theme = useTheme()
//   const { state } = useAuth()

//   const [answer, setAnswer] = useState("")
//   const [interviewStarted, setInterviewStarted] = useState(false)

//   const questions = useSelector((state: StoreType) => state.interview.questions)
//   const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex)
//   const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks as unknown as { feedback: string; score: number }[])
//   const isFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished)
//   const averageScore = useSelector((state: StoreType) => state.interview.averageScore)
//   const summary = useSelector((state: StoreType) => state.interview.summary)
//   const resumeFilePath = state.resume?.filePath
//   const strengths = summary[0] || [];
//   const toImprove = summary[1] || [];
//   useEffect(() => {
//     if (resumeFilePath && interviewStarted) {
//       console.log("Uploading resume...")
//       dispatch(uploadResume(resumeFilePath))
//     }
//   }, [resumeFilePath, interviewStarted, dispatch])
//   useEffect(() => {
//     if (resumeFilePath && interviewStarted) {
//       console.log("Uploading resume...")
//       dispatch(uploadResume(resumeFilePath))
//     }
//   }, [])
//   const handleSubmitAnswer = async () => {
//     if (!answer.trim()) return

//     const currentQuestion = questions[currentQuestionIndex]
//     const result = await dispatch(checkAnswer({ question: currentQuestion, answer })).unwrap()
//     dispatch(addFeedback(result))

//     if (currentQuestionIndex >= questions.length - 1) {
//       dispatch(evaluateResponses())
//     } else {
//       dispatch(nextQuestion())
//     }

//     setAnswer("")
//   }

//   const startInterview = () => {
//     setInterviewStarted(true)
//   }

//   if (!interviewStarted) {
//     return (
//       <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
//         <Typography variant="h4" color="primary" gutterBottom>
//           סימולציית ראיון עבודה
//         </Typography>
//         <Typography variant="body1" paragraph>
//           כדי להתחיל את הראיון, לחצי על הכפתור הבא:
//         </Typography>
//         <Button variant="contained" color="primary" onClick={startInterview}>
//           🚀 התחל ראיון
//         </Button>
//       </Container>
//     )
//   }
//   function FinalMark(results: { feedback: string; score: number }[]) {
//     return results.reduce((total, item) => total + item.score, 0);
//   }
  

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={8}>
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//             {!isFinished ? (
//               <>
//                 <Typography variant="h5" color="primary" gutterBottom>
//                   שאלה {currentQuestionIndex + 1}:
//                 </Typography>
//                 <Typography variant="body1" paragraph>
//                   {questions[currentQuestionIndex]}
//                 </Typography>
//                 <textarea
//                   rows={6}
//                   value={answer}
//                   onChange={(e) => setAnswer(e.target.value)}
//                   placeholder="כתבי את תשובתך כאן..."
//                   style={{ width: "100%", padding: 12, fontSize: "1rem", borderRadius: 8 }}
//                 />
//                 <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmitAnswer}
//                     disabled={!answer.trim()}
//                   >
//                     שלחי תשובה
//                   </Button>
//                 </Box>
//               </>
//             ) : (
//               <Box textAlign="center">
//                 <Typography variant="h4" color="primary" gutterBottom>
//                   הראיון הסתיים!
//                 </Typography>
//                 <Typography variant="body1" paragraph>
//                   תודה על השתתפותך. להלן המשוב שלך:
//                 </Typography>
//               </Box>
//             )}
//           </Paper>
//         </Grid>

//         <Grid item xs={12} md={4}>
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
//             {isFinished ? (
//               <>
//                 <Box textAlign="center" mb={3}>
//                   <CircularProgress
//                     variant="determinate"
//                     value={averageScore ?? 0}
//                     size={100}
//                     thickness={5}
//                     color="primary"
//                   />
//                   <Typography variant="h5" color="primary" mt={2}>
//                     ציון : {FinalMark(feedbacks)}% מתוך 100%
//                   </Typography>
//                 </Box>

//                 <div>
//                 const strengths = summary[0] || [];
//                 const toImprove = summary[1] || [];
//       <Typography variant="h6" gutterBottom color="primary">
//         סיכום
//       </Typography>

//       <Typography variant="subtitle1" color="secondary">
//         חוזקות:
//       </Typography>
//       <List dense>
//         {strengths.map((point, index) => (
//           <ListItem key={`strength-${index}`}>
//             <ListItemIcon>
//               <CheckCircleIcon color="success" />
//             </ListItemIcon>
//             <ListItemText primary={point} />
//           </ListItem>
//         ))}
//       </List>

//       <Typography variant="subtitle1" color="error">
//         נקודות לשיפור:
//       </Typography>
//       <List dense>
//         {toImprove.map((point, index) => (
//           <ListItem key={`improve-${index}`}>
//             <ListItemIcon>
//               <ErrorOutlineIcon color="error" />
//             </ListItemIcon>
//             <ListItemText primary={point} />
//           </ListItem>
//         ))}
//       </List>
//     </div>
//               </>
//             ) : (
//               <>
//                 <Typography variant="h6" color="primary" gutterBottom>
//                   תשובות קודמות
//                 </Typography>
//                 {feedbacks.map((f, i) => (
//                   <Card key={i} sx={{ mb: 2 }}>
//                     <CardContent>
//                       <Typography variant="subtitle2" color="primary">
//                         שאלה {i + 1}
//                       </Typography>
//                       <Typography variant="body2" gutterBottom>
//                         {questions[i]}
//                       </Typography>
//                       <Divider sx={{ my: 1 }} />
//                       <Typography variant="subtitle2">משוב:</Typography>
//                       <Typography variant="body2">{f.feedback}</Typography>
//                       <Chip label={`ציון: ${f.score}%`} sx={{ mt: 1 }} color="success" />
//                     </CardContent>
//                   </Card>
//                 ))}
//               </>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   )
// }

// export default InterviewReduxStyled
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAuth } from "./AuthContext"
import {
  checkAnswer,
  nextQuestion,
  addFeedback,
  uploadResume,
  evaluateResponses,
} from "../store/interviewSlice"
import { StoreType } from "../store/store"
import InterviewFeedback from "./InterviewFeedback"

const Interview = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { state } = useAuth()

  const [answer, setAnswer] = useState("")
  const [interviewStarted, setInterviewStarted] = useState(false)

  const questions = useSelector((state: StoreType) => state.interview.questions)
  const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex)
  const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks as unknown as { feedback: string; score: number }[])
  const isFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished)
  const averageScore = useSelector((state: StoreType) => state.interview.averageScore)
  const summary = useSelector((state: StoreType) => state.interview.summary as unknown as string[][])
  const resumeFilePath = state.resume?.filePath

  useEffect(() => {
    if (resumeFilePath && interviewStarted) {
      dispatch(uploadResume(resumeFilePath))
    }
  }, [resumeFilePath, interviewStarted, dispatch])

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const result = await dispatch(checkAnswer({ question: currentQuestion, answer })).unwrap()
    dispatch(addFeedback(result))

    if (currentQuestionIndex >= questions.length - 1) {
      dispatch(evaluateResponses())
    } else {
      dispatch(nextQuestion())
    }

    setAnswer("")
  }

  const startInterview = () => {
    setInterviewStarted(true)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {!interviewStarted ? (
              <Box textAlign="center" mt={8}>
                <Typography variant="h4" color="primary" gutterBottom>
                  סימולציית ראיון עבודה
                </Typography>
                <Typography variant="body1" paragraph>
                  כדי להתחיל את הראיון, לחצי על הכפתור הבא:
                </Typography>
                <Button variant="contained" color="primary" onClick={startInterview}>
                  🚀 התחל ראיון
                </Button>
              </Box>
            ) : !isFinished ? (
              <>
                <Typography variant="h5" color="primary" gutterBottom>
                  שאלה {currentQuestionIndex + 1}:
                </Typography>
                <Typography variant="body1" paragraph>
                  {questions[currentQuestionIndex]}
                </Typography>
                <textarea
                  rows={6}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="כתבי את תשובתך כאן..."
                  style={{ width: "100%", padding: 12, fontSize: "1rem", borderRadius: 8 }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim()}
                  >
                    שלחי תשובה
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="h5" color="primary">
                הראיון הסתיים!
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {isFinished ? (
            
         
              <InterviewFeedback
                feedbacks={feedbacks}
                averageScore={averageScore ?? 0}
                summary={summary}
                questions={questions}
              />
          
            ) : (
              <>
                <Typography variant="h6" color="primary" gutterBottom>
                  תשובות קודמות
                </Typography>
                {feedbacks.map((f, i) => (
                  <Card key={i} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">
                        שאלה {i + 1}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {questions[i]}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2">משוב:</Typography>
                      <Typography variant="body2">{f.feedback}</Typography>
                      <Chip label={`ציון: ${f.score}%`} sx={{ mt: 1 }} color="success" />
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Interview
