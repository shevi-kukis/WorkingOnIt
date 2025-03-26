import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import Question from './Question';
import { checkAnswer, nextQuestion,addFeedback, uploadResume, evaluateResponses } from '../store/interviewSlice';
import { StoreType } from '../store/store';


const Interview = () => {
    const dispatch = useDispatch();
    const { state } = useAuth();
    
    // קבלת נתונים מה-Redux
    const questions = useSelector((state: StoreType) => state.interview.questions) || [];
    const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex) ?? 0;
    const isInterviewFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished) ?? false;
    const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
    const averageScore = useSelector((state: StoreType) => state.interview.averageScore);
    const summary = useSelector((state: StoreType) => state.interview.summary);
    
    // קובץ קורות החיים של המשתמש
    const resumeFilePath = state.resume?.filePath; 

    // טעינת השאלות מהשרת עם העלאת קובץ קורות החיים
    useEffect(() => {
        if (resumeFilePath) {
            console.log('Uploading resume:', resumeFilePath);
            dispatch(uploadResume(resumeFilePath));
        }
    }, [resumeFilePath, dispatch]);

    // הצגת מידע בקונסולה לניפוי באגים
    useEffect(() => {
        console.log("Questions loaded:", questions);
        console.log("Current question index:", currentQuestionIndex);
        console.log("Is interview finished:", isInterviewFinished);
    }, [questions, currentQuestionIndex, isInterviewFinished]);

    // טיפול במשוב המשתמש על השאלה
    const handleFeedbackReceived = async (feedback: string) => {
        console.log("Feedback received:", feedback);
    
        const question = questions[currentQuestionIndex];
    
        try {
            const response = await dispatch(checkAnswer({ question, answer: feedback })).unwrap();
            console.log("Feedback received:", response);
    
            dispatch(addFeedback(response)); // הוספת הפידבק לרשימה
        } catch (error) {
            console.error("Error in checkAnswer:", error);
        }
    
        // אם יש עוד שאלות - עוברים לשאלה הבאה
        if (currentQuestionIndex < questions.length - 1) {
            dispatch(nextQuestion());
        } else {
            console.log("Interview finished, evaluating responses...");
            dispatch(evaluateResponses());
        }
    };
    
    // אם אין שאלות עדיין - להציג הודעת טעינה
    if (!questions || questions.length === 0) {
        return <div>🔄 טוען שאלות... אנא המתן</div>;
    }

    return (
        <div style={{ marginTop: '10000px', position: 'relative', zIndex: 10 ,color: 'black'}}>

            
            <h1>סימולציית ראיון עבודה</h1>
    
            {isInterviewFinished ? (
                <div>
                    <div style={{ color: 'black' }}>{summary}</div>
                    <h2>המשוב הכללי</h2>
                    <p style={{ color: 'black' }}>ציון ממוצע: {averageScore}</p>
                    <p>סיכום: {summary}</p>
                    <h3>משובים לכל השאלות:</h3>
                    <ul>
    {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
            <li key={index}>
              
                <p style={{ color: 'black' }}>ציון: {feedback.score}</p>
                <p style={{ color: 'black' }}>תשובה נכונה: {feedback.correct ? 'נכון' : 'לא נכון'}</p>
                <p style={{ color: 'black' }}>תשובה נכונה: {feedback.correct_answer}</p>
            </li>
        ))
    ) : (
        <p>אין משובים להציג</p>
    )}
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
