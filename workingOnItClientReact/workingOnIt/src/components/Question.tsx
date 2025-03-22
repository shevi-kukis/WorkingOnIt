import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAnswer } from '../store/interviewSlice';


const Question = ({ question, onFeedbackReceived }) => {
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const feedback = await dispatch(checkAnswer({ question, answer })).unwrap();
            onFeedbackReceived(feedback);
        } catch (error) {
            console.error('Error checking answer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>{question}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={answer}
                    onChange={handleAnswerChange}
                    placeholder="הקלד את התשובה שלך"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'שולח...' : 'שלח תשובה'}
                </button>
            </form>
        </div>
    );
};

export default Question;