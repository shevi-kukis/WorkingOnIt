import React, { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import axios from "axios"
import { useAuth } from "./AuthContext"
import { Box, Typography, Paper } from "@mui/material"
import axiosInstance from "./axiosInstance"

interface ScoreEntry {
  score: number
  date: string
}

const InterviewScoresChart: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const { state } = useAuth()

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axiosInstance.get(`/Interview/scores/${state.user?.id}`)
        setScores(response.data)
   console.log("Fetched scores", response.data)

      } catch (error) {
        console.error("Error fetching scores", error)
      }
    }

    if (state.user?.id) {
      fetchScores()
    }
  }, [state.user?.id])

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h6" gutterBottom color="primary">
        גרף ציונים - התקדמות לאורך זמן
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={scores}>
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  )
}

export default InterviewScoresChart
