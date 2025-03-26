import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkAnswer } from '../store/interviewSlice';


interface QuestionProps {
    question: string;
    onFeedbackReceived: (feedback: any) => void;
}

const Question: React.FC<QuestionProps> = ({ question, onFeedbackReceived }) => {
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(e.target.value);
    };



    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    console.log("Current question index after dispatch:", question);
    return (
        <div>

<h2 style={{ color: 'black' }}>{question}</h2>

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