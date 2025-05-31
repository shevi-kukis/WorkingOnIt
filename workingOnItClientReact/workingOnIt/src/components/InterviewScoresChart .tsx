"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "./AuthContext"
import { Container, Card, CardContent, CardHeader, Typography, Box, useTheme, Avatar, Button } from "@mui/material"
import { TrendingUp, Assessment, PlayArrow } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import axiosInstance from "./axiosInstance"

interface ScoreEntry {
  score: number
  date: string
}

const InterviewScoresChart: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { state } = useAuth()
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchScores = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/Interview/scores/${state.user?.id}`)
        setScores(response.data)
        console.log("Fetched scores", response.data)
      } catch (error) {
        console.error("Error fetching scores", error)
        setScores([])
      } finally {
        setLoading(false)
      }
    }

    if (state.user?.id) {
      fetchScores()
    } else {
      setLoading(false)
    }
  }, [state.user?.id])

  const handleStartInterview = () => {
    navigate("/interview")
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={2}>
          <CardContent sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading your progress...
            </Typography>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!scores || scores.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card elevation={2}>
          <CardHeader>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6">Progress Chart - Performance Over Time</Typography>
            </Box>
          </CardHeader>
          <CardContent>
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: theme.palette.grey[100],
                  color: theme.palette.grey[400],
                }}
              >
                <Assessment sx={{ fontSize: 50 }} />
              </Avatar>

              <Box>
                <Typography variant="h5" gutterBottom color="text.primary">
                  No Interview Data Yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  You haven't completed any interviews yet. Start your first interview to see your progress here!
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStartInterview}
                sx={{ mt: 2, px: 4, py: 1.5 }}
              >
                Start Your First Interview
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={2}>
        <CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6">Progress Chart - Performance Over Time</Typography>
          </Box>
        </CardHeader>
        <CardContent>
          <Box sx={{ height: 300, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scores}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke={theme.palette.primary.main} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default InterviewScoresChart
