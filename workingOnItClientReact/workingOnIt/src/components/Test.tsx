

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Question from './Question';
import { checkAnswer, uploadResume } from '../store/interviewSlice';
import RootState from '../store/store'; // Adjust the path to your store file



const Interview = () => {
    const dispatch = useDispatch();
    const questions = useSelector((state) => state.interview.questions);
    const currentQuestionIndex = useSelector((state) => state.interview.currentQuestionIndex);
    const feedbacks = useSelector((state) => state.interview.feedbacks);
    const [file, setFile] = React.useState('');

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }

    };
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(uploadResume(file));
         // שולחים את הפעולה ל-Redux
    };


    const handleFeedbackReceived = (feedback) => {
        dispatch(checkAnswer({ question: questions[currentQuestionIndex], answer: feedback }));
        dispatch(nextQuestion()); // מעדכן את currentQuestionIndex
    };


    return (
        <div>
            <h1>שאלות מהשרת</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleChange}
                />
                <button type="submit">שלח קורות חיים</button>
            </form>

            {currentQuestionIndex < questions.length && (
                <Question
                    question={questions[currentQuestionIndex]}
                    onFeedbackReceived={handleFeedbackReceived}
                />
            )}

            {feedbacks.length > 0 && (
                <div>
                    <h3>משובים:</h3>
                    <ul>
                        {feedbacks.map((feedback, index) => (
                            <li key={index}>{feedback}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Interview;

