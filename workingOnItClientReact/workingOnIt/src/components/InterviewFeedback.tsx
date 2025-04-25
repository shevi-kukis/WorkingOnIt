import React from "react"
import { Typography, Box, CircularProgress, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Feedback {
  feedback: string;
  score: number;
}

interface Props {
  feedbacks: Feedback[];
  averageScore: number;
  summary: string[][];
  questions: string[];
}

const FinalMark = (results: Feedback[]) => {
  return results.reduce((total, item) => total + item.score, 0)
}

const InterviewFeedback: React.FC<Props> = ({ feedbacks, averageScore, summary }) => {
    const strengths = Array.isArray(summary?.[0]) ? summary[0] : [];
    const toImprove = Array.isArray(summary?.[1]) ? summary[1] : [];
    

  return (
    <>
      <Box textAlign="center" mb={3}>
        <CircularProgress
          variant="determinate"
          value={averageScore ?? 0}
          size={100}
          thickness={5}
          color="primary"
        />
        <Typography variant="h5" color="primary" mt={2}>
          ציון : {FinalMark(feedbacks)}% מתוך 100%
        </Typography>
      </Box>

      <Typography variant="h6" gutterBottom color="primary">
        סיכום
      </Typography>

      <Typography variant="subtitle1" color="secondary">
        חוזקות:
      </Typography>
      <List dense>
        {strengths.map((point, index) => (
          <ListItem key={`strength-${index}`}>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary={point} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" color="error">
        נקודות לשיפור:
      </Typography>
      <List dense>
        {toImprove.map((point, index) => (
          <ListItem key={`improve-${index}`}>
            <ListItemIcon>
              <ErrorOutlineIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={point} />
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default InterviewFeedback;
