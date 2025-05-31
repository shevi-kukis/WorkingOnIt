"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  TextField,
  useTheme,
  CircularProgress,
  Backdrop,
  Alert,
} from "@mui/material"
import { Send, PlayArrow, Upload } from "@mui/icons-material"
import { useAuth } from "./AuthContext"
import { checkAnswer, nextQuestion, uploadResume, evaluateResponses, resetInterview } from "../store/interviewSlice"
import type { StoreType } from "../store/store"
import InterviewFeedback from "./InterviewFeedback"
import axiosInstance from "./axiosInstance"
import { useNavigate } from "react-router-dom"

const Interview = () => {
  const dispatch = useDispatch()
  const theme = useTheme()
  const { state } = useAuth()
  const navigate = useNavigate()

  const [answer, setAnswer] = useState("")
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)

  const questions = useSelector((state: StoreType) => state.interview.questions)
  const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex)
  const feedbacks = useSelector(
    (state: StoreType) => state.interview.feedbacks as unknown as { feedback: string; score: number }[],
  )
  const isFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished)
  let summary = useSelector((state: StoreType) => state.interview.summary as unknown as string[][])

  const resumeFilePath = state.resume?.filePath
  const totalScore = feedbacks.reduce((total, item) => total + item.score, 0)
  const hasSubmittedScore = useRef(false)

  useEffect(() => {
    const saveScore = async () => {
      if (interviewStarted && isFinished && state.user?.id && feedbacks.length > 0 && !hasSubmittedScore.current) {
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
      console.log("📄 resumeFilePath sent to server:", resumeFilePath)
      setIsLoadingQuestions(true)
      dispatch(uploadResume(resumeFilePath)).finally(() => {
        setIsLoadingQuestions(false)
      })
    }
  }, [resumeFilePath, interviewStarted, dispatch])

  useEffect(() => {
    dispatch(resetInterview())
  }, [dispatch])

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    setIsSubmitting(true)
    try {
      const currentQuestion = questions[currentQuestionIndex]
      const result = await dispatch(checkAnswer({ question: currentQuestion, answer })).unwrap()

      if (currentQuestionIndex >= questions.length - 1) {
        summary = await dispatch(evaluateResponses())
        if (evaluateResponses.fulfilled.match(result)) {
          console.log("Feedback received:", result.payload)
        }
      } else {
        await dispatch(nextQuestion())
      }

      setAnswer("")
    } catch (error) {
      console.error("Error submitting answer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const startInterview = () => {
    // Check if user has uploaded a resume
    if (!resumeFilePath) {
      return // Don't start interview without resume
    }

    hasSubmittedScore.current = false
    dispatch(resetInterview())
    setInterviewStarted(true)
  }

  const handleUploadResume = () => {
    navigate("/uploadResume")
  }

  if (isFinished) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <InterviewFeedback />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting || isLoadingQuestions}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress color="inherit" />
          <Typography>{isLoadingQuestions ? "Loading interview questions..." : "Processing your answer..."}</Typography>
        </Box>
      </Backdrop>

      {!interviewStarted ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <Card sx={{ maxWidth: 500, width: "100%", textAlign: "center" }}>
            <CardHeader>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <img src="/logo.svg" alt="WorkingOnIt Logo" style={{ height: 80 }} />
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                Interview Simulation
              </Typography>
            </CardHeader>
            <CardContent sx={{ pb: 4 }}>
              {!resumeFilePath ? (
                <>
                  <Alert severity="warning" sx={{ mb: 3, textAlign: "left" }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Resume Required
                    </Typography>
                    <Typography variant="body2">
                      You need to upload your resume before starting the interview. This helps us generate personalized
                      questions for you.
                    </Typography>
                  </Alert>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Upload />}
                    onClick={handleUploadResume}
                    sx={{ mt: 2, px: 4, py: 1.5 }}
                  >
                    Upload Resume First
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="body1" paragraph color="text.secondary">
                    Click the button below to start your interview:
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={startInterview}
                    sx={{ mt: 2, px: 4, py: 1.5 }}
                  >
                    Start Interview
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {/* Chat Header */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src="/logo.svg" alt="WorkingOnIt Logo" style={{ height: 24 }} />
                <Typography variant="h6" color="primary">
                  Job Interview
                </Typography>
              </Box>
              <Chip
                label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Paper>

          {/* Chat Messages */}
          <Box sx={{ mb: 3 }}>
            {/* Interviewer Message */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Avatar sx={{ bgcolor: theme.palette.grey[400], color: "white", fontWeight: 600 }}>I</Avatar>
              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                  }}
                >
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Interviewer:
                  </Typography>
                  <Typography variant="body1">{questions[currentQuestionIndex]}</Typography>
                </Paper>
              </Box>
            </Box>

            {/* User Input */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main, fontWeight: 600 }}>
                {state.user?.fullName?.charAt(0) || "U"}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Paper elevation={1} sx={{ p: 3, borderRadius: 2, borderTopLeftRadius: 0 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Type your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    disabled={isSubmitting || isLoadingQuestions}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      variant="contained"
                      endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Send />}
                      onClick={handleSubmitAnswer}
                      disabled={!answer.trim() || isSubmitting || isLoadingQuestions}
                    >
                      {isSubmitting ? "Submitting..." : "Send Answer"}
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  )
}

export default Interview
