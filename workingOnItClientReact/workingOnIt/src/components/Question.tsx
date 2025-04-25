"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Alert,
  useTheme,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"

interface QuestionProps {
  question: {
    id: string
    text: string
    type: "text" | "multipleChoice"
    options?: string[]
    correctAnswer?: string
  }
  onSubmit: (answer: string, isCorrect: boolean) => void
}

const Question = ({ question, onSubmit }: QuestionProps) => {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const theme = useTheme()

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value)
  }

  const handleSubmit = () => {
    if (!answer.trim()) return

    // Determine if answer is correct (for multiple choice)
    let correct = false
    if (question.type === "multipleChoice" && question.correctAnswer) {
      correct = answer === question.correctAnswer
    } else {
      // For text questions, we'll assume it's correct (would need backend validation)
      correct = true
    }

    setIsCorrect(correct)
    setSubmitted(true)
    onSubmit(answer, correct)
  }

  const handleNext = () => {
    setAnswer("")
    setSubmitted(false)
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {submitted && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            p: 1,
            bgcolor: isCorrect ? "success.light" : "error.light",
            color: "white",
            borderBottomLeftRadius: 8,
          }}
        >
          {isCorrect ? <CheckCircleIcon /> : <ErrorIcon />}
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          Question
        </Typography>
        <Typography variant="body1">{question.text}</Typography>
      </Box>

      {!submitted ? (
        <>
          {question.type === "multipleChoice" && question.options ? (
            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel component="legend" sx={{ color: theme.palette.text.secondary }}>
                Select your answer:
              </FormLabel>
              <RadioGroup value={answer} onChange={handleRadioChange}>
                {question.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio color="primary" />}
                    label={option}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Type your answer here..."
              variant="outlined"
              value={answer}
              onChange={handleTextChange}
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={!answer.trim()}
            >
              Submit Answer
            </Button>
          </Box>
        </>
      ) : (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your Answer:
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body1">{answer}</Typography>
            </Box>
          </Box>

          {question.type === "multipleChoice" && question.correctAnswer && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Correct Answer:
              </Typography>
              <Chip label={question.correctAnswer} color="success" variant="outlined" icon={<CheckCircleIcon />} />
            </Box>
          )}

          <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 3 }}>
            {isCorrect
              ? "Great job! Your answer is correct."
              : "Your answer is incorrect. Please review the correct answer."}
          </Alert>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next Question
            </Button>
          </Box>
        </Box>
      )}
    </Paper>
  )
}

export default Question
