"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Collapse,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material"
import { CheckCircle, Cancel, ExpandMore, ExpandLess, EmojiEvents, TrendingUp, Warning } from "@mui/icons-material"

const InterviewFeedback: React.FC = () => {
  const theme = useTheme()
  const feedbacks = useSelector((state: any) => state.interview.feedbacks)
  const questions = useSelector((state: any) => state.interview.questions)
  const summary = useSelector((state: any) => state.interview.summary)

  const [openIndexes, setOpenIndexes] = useState<number[]>([])

  const toggleFeedback = (index: number) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  useEffect(() => {
    console.log("Updated summary:", summary)
  }, [summary])

  const strengths: string[] = summary?.strengths || []
  const toImprove: string[] = summary?.weaknesses || []

  if (Array.isArray(summary)) {
    summary.flat().forEach((item: string) => {
      if (item.toLowerCase().startsWith("strengths:") || item.toLowerCase().startsWith("strong at:")) {
        strengths.push(item.replace(/^.*?:\s*/, ""))
      } else if (
        item.toLowerCase().startsWith("areas for improvement:") ||
        item.toLowerCase().startsWith("needs improvement:")
      ) {
        toImprove.push(item.replace(/^.*?:\s*/, ""))
      }
    })
  }

  const FinalMark = (feedbacks: any[]) => {
    return feedbacks.reduce((total, item) => total + item.score, 0)
  }

  const finalScore = FinalMark(feedbacks)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.primary.main, mx: "auto", mb: 2 }}>
          <EmojiEvents sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" gutterBottom>
          Interview Complete
        </Typography>
      </Box>

      {/* Score Card */}
      <Card elevation={3} sx={{ mb: 4, textAlign: "center" }}>
        <CardHeader>
          <Typography variant="h5">Your Final Score</Typography>
        </CardHeader>
        <CardContent>
          <Typography variant="h2" color="primary" fontWeight="bold" gutterBottom>
            {finalScore}%
          </Typography>
          <Typography variant="body1" color="text.secondary">
            out of 100%
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mb: 4 }}>
        {/* Strengths */}
        <Card elevation={2}>
          <CardHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircle sx={{ color: "success.main" }} />
              <Typography variant="h6" color="success.main">
                Strengths
              </Typography>
            </Box>
          </CardHeader>
          <CardContent>
            <List dense>
              {strengths.map((point, index) => (
                <ListItem key={`strength-${index}`}>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Areas for Improvement */}
        <Card elevation={2}>
          <CardHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp sx={{ color: "warning.main" }} />
              <Typography variant="h6" color="warning.main">
                Areas for Improvement
              </Typography>
            </Box>
          </CardHeader>
          <CardContent>
            <List dense>
              {toImprove.map((point, index) => (
                <ListItem key={`improve-${index}`}>
                  <ListItemIcon>
                    <Warning color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={point} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>

      {/* Question Feedback */}
      <Card elevation={2}>
        <CardHeader>
          <Typography variant="h6">Detailed Question Feedback</Typography>
        </CardHeader>
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {questions.map((question: string, index: number) => {
              const feedback = feedbacks[index]
              const isOpen = openIndexes.includes(index)
              return (
                <Paper key={index} elevation={1} sx={{ overflow: "hidden" }}>
                  <Button
                    fullWidth
                    onClick={() => toggleFeedback(index)}
                    sx={{
                      p: 2,
                      justifyContent: "space-between",
                      textAlign: "left",
                      color: "text.primary",
                      textTransform: "none",
                    }}
                  >
                    <Box sx={{ flex: 1, textAlign: "left" }}>
                      <Typography variant="body1" fontWeight="medium">
                        {question}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {feedback && (
                        <Chip
                          label={`${feedback.score}%`}
                          color={feedback.correct ? "success" : "error"}
                          size="small"
                        />
                      )}
                      {isOpen ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  </Button>
                  <Collapse in={isOpen}>
                    {feedback && (
                      <Box sx={{ p: 3, bgcolor: "background.default", borderTop: 1, borderColor: "divider" }}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Your Answer:
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feedback.userAnswer}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                          <Typography variant="subtitle2">Status:</Typography>
                          <Chip
                            icon={feedback.correct ? <CheckCircle /> : <Cancel />}
                            label={feedback.correct ? "Correct" : "Incorrect"}
                            color={feedback.correct ? "success" : "error"}
                            size="small"
                          />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Score: {feedback.score}%
                          </Typography>
                        </Box>
                        {!feedback.correct && feedback.correct_answer && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Correct Answer:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {feedback.correct_answer}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Collapse>
                </Paper>
              )
            })}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default InterviewFeedback
