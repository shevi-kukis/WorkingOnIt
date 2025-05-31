// // "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
// import { useAuth } from "./AuthContext"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { TrendingUp } from "lucide-react"
// import axiosInstance from "./axiosInstance"

// interface ScoreEntry {
//   score: number
//   date: string
// }

// const InterviewScoresChart: React.FC = () => {
//   const [scores, setScores] = useState<ScoreEntry[]>([])
//   const { state } = useAuth()

//   useEffect(() => {
//     const fetchScores = async () => {
//       try {
//         const response = await axiosInstance.get(`/Interview/scores/${state.user?.id}`)
//         setScores(response.data)
//         console.log("Fetched scores", response.data)
//       } catch (error) {
//         console.error("Error fetching scores", error)
//       }
//     }

//     if (state.user?.id) {
//       fetchScores()
//     }
//   }, [state.user?.id])

//   return (
//     <div className="container mx-auto p-6">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5" />
//             גרף ציונים - התקדמות לאורך זמן
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={scores}>
//                 <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
//                 <XAxis dataKey="date" />
//                 <YAxis domain={[0, 100]} />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default InterviewScoresChart
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAuth } from "./AuthContext"
import { Container, Card, CardContent, CardHeader, Typography, Box, useTheme } from "@mui/material"
import { TrendingUp } from "@mui/icons-material"
import axiosInstance from "./axiosInstance"

interface ScoreEntry {
  score: number
  date: string
}

const InterviewScoresChart: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const { state } = useAuth()
  const theme = useTheme()

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card elevation={2}>
        <CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp color="primary" />
            <Typography variant="h6">גרף ציונים - התקדמות לאורך זמן</Typography>
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
