import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const InterviewFeedback: React.FC = () => {
    const feedbacks = useSelector((state: any) => state.interview.feedbacks);
    const questions = useSelector((state: any) => state.interview.questions);
 
    const summary = useSelector((state: any) => state.interview.summary);
console.log("summary", summary)
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    const toggleFeedback = (index: number) => {
        setOpenIndexes((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };
  
    useEffect(() => {
        console.log("Updated summary:", summary);
      }, [summary]);
const strengths: string[] = [];
const toImprove: string[] = [];

if (Array.isArray(summary)) {
  summary.flat().forEach((item: string) => {
    if (item.toLowerCase().startsWith("strengths:") || item.toLowerCase().startsWith("strong at:")) {
      strengths.push(item.replace(/^.*?:\s*/, ""));
    } else if (
      item.toLowerCase().startsWith("areas for improvement:") ||
      item.toLowerCase().startsWith("needs improvement:")
    ) {
      toImprove.push(item.replace(/^.*?:\s*/, ""));
    }
  });
}

    

    const FinalMark = (feedbacks: any[]) => {
        return feedbacks.reduce((total, item) => total + item.score, 0);
      
    };

    return (
        
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">סיום הראיון</h2>

            {/* ציון ומסכם כללי */}
            <Box textAlign="center" mb={3}>
                <Typography variant="h5" color="primary" mt={2}>
                    ציון : {FinalMark(feedbacks)}% מתוך 100%
                </Typography>
     
            </Box>

           

            {/* חוזקות */}
            <Typography variant="subtitle1" color="secondary" gutterBottom>
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

            {/* נקודות לשיפור */}
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

            {/* משוב על שאלות */}
            <div>
           
                {questions.map((question: string | number | React.ReactElement | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | React.ReactPortal | React.ReactElement | Iterable<React.ReactNode> | null | undefined> | null | undefined, index: number) => {
                    const feedback = feedbacks[index];  // משוב ספציפי לשאלה הנוכחית
                    return (
                        <div key={index} className="mb-4 border rounded-xl shadow-sm p-4">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{question}</p>
                                <button
                                    className="text-blue-600 hover:underline"
                                    onClick={() => toggleFeedback(index)}
                                >
                                    {openIndexes.includes(index) ? 'הסתר משוב' : 'הצג משוב'}
                                </button>
                            </div>
                            {openIndexes.includes(index) && feedback && (
                                <div className="mt-3 bg-gray-50 p-3 rounded-lg border text-sm">
                                    <p><strong>תשובתך:</strong> {feedback.userAnswer}</p>
                                    <p><strong>משוב:</strong> {feedback.correct ? 'נכון' : 'לא נכון'}</p>
                                    <p><strong>ציון:</strong> {feedback.score}</p>
                                    {!feedback.correct && feedback.correct_answer && (
                                        <p><strong>תשובה נכונה:</strong> {feedback.correct_answer}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InterviewFeedback;
