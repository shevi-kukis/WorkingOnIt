import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
 
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { useAuth } from "./AuthContext"
import {
  checkAnswer,
  nextQuestion,
  uploadResume,
  evaluateResponses,
  resetInterview,
} from "../store/interviewSlice"
import { StoreType } from "../store/store"
import InterviewFeedback from "./InterviewFeedback"
import axios from "axios"
import axiosInstance from "./axiosInstance"

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
  const summary = useSelector((state: StoreType) => state.interview.summary as unknown as string[][])

  const resumeFilePath = state.resume?.filePath

  const totalScore = feedbacks.reduce((total, item) => total + item.score, 0)
  const hasSubmittedScore = useRef(false)

  // useEffect(() => {
  //   const saveScore = async () => {
  //     if (isFinished && state.user?.id && feedbacks.length > 0 && !hasSubmittedScore.current) {
  //       try {
  //         await axiosInstance.post("/Interview/submit", {
  //           userId: state.user.id,
  //           score: totalScore,
  //         })
  //         console.log("Interview score saved")
  //         hasSubmittedScore.current = true // סימון שהציון נשמר
  //       } catch (error) {
  //         console.error("Failed to save interview score:", error)
  //       }
  //     }
  //   }
  
  //   saveScore()
  // }, [isFinished, state.user?.id, feedbacks, totalScore])
  useEffect(() => {
    const saveScore = async () => {
      if (
        interviewStarted && // 👈 בדיקה חדשה
        isFinished &&
        state.user?.id &&
        feedbacks.length > 0 &&
        !hasSubmittedScore.current
      ) {
        try {
          await axiosInstance.post("/Interview/submit", {
            userId: state.user.id,
            score: totalScore,
          })
          console.log("Interview score saved")
          hasSubmittedScore.current = true
        } catch (error) {
          console.error("Failed to save interview score:", error)
        }
      }
    }
  
    saveScore()
  }, [interviewStarted, isFinished, state.user?.id, feedbacks, totalScore])
  
  useEffect(() => {
    if (resumeFilePath && interviewStarted) {
      console.log("📄 resumeFilePath שנשלח לשרת:", resumeFilePath)
      dispatch(uploadResume(resumeFilePath))
    }
  }, [resumeFilePath, interviewStarted, dispatch])
  
  useEffect(() => {
    dispatch(resetInterview())
  }, [dispatch])
  // useEffect(() => {
  //   const saveScore = async () => {
  //     if (isFinished && state.user?.id && feedbacks.length > 0) {
  //       try {
  //         await axiosInstance.post("/Interview/submit", {
  //           userId: state.user.id,
  //           score: totalScore,
  //         })
  //         console.log("Interview score saved")
  //       } catch (error) {
  //         console.error("Failed to save interview score:", error)
  //       }
  //     }
  //   }

  //   saveScore()
  // }, [isFinished, state.user?.id, feedbacks, totalScore])

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    const currentQuestion = questions[currentQuestionIndex]
    const result = await dispatch(checkAnswer({ question: currentQuestion, answer })).unwrap()
    // await dispatch(addFeedback(result))

    if (currentQuestionIndex >= questions.length - 1) {
      await dispatch(evaluateResponses())
    } else {
      await dispatch(nextQuestion())
    }

    setAnswer("")
  }

  const startInterview = () => {
    hasSubmittedScore.current = false
    dispatch(resetInterview())
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
        
            
                      
          {isFinished && (
  <InterviewFeedback />
)}

       
        </Grid>
      </Grid>
    </Container>
  )
}

export default Interview
