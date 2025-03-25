
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import Question from './Question';
import { checkAnswer, nextQuestion, uploadResume, evaluateResponses } from '../store/interviewSlice';
import { StoreType } from '../store/store';

const Interview = () => {
    const dispatch = useDispatch();
    const { state } = useAuth();
    
    const questions = useSelector((state: StoreType) => state.interview.questions);
    const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex);
    const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
    const averageScore = useSelector((state: StoreType) => state.interview.averageScore);
    const summary = useSelector((state: StoreType) => state.interview.summary);
     const resumeFilePath = state.resume?.filePath; 

    useEffect(() => {
        if (resumeFilePath) {
            console.log('Uploading resume:', resumeFilePath);
            dispatch(uploadResume(resumeFilePath));
        }
    }, [resumeFilePath, dispatch]);

    const handleFeedbackReceived = (feedback: string) => {
        dispatch(checkAnswer({ question: questions[currentQuestionIndex], answer: feedback }));
        
        if (currentQuestionIndex < questions.length - 1) {
            dispatch(nextQuestion());
        } else {
            dispatch(evaluateResponses(feedbacks));
        }
    };

    const isInterviewFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished);

    return (
        <div>
            <h1>סימולציית ראיון עבודה</h1>
    
            {isInterviewFinished ? (
                <div>
                    <h2>המשוב הכללי</h2>
                    <p>ציון ממוצע: {averageScore}</p>
                    <p>סיכום: {summary}</p>
                    <h3>משובים לכל השאלות:</h3>
                    <ul>
                        {feedbacks.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <Question
                    question={questions[currentQuestionIndex]}
                    onFeedbackReceived={handleFeedbackReceived}
                />
            )}
        </div>
    );
    
};

export default Interview;
