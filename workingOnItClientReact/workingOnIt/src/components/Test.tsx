import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadResume } from '../store/interviewSlice';
import type RootState from '../store/store'; // Import the RootState type
import QuestionComponent from './Question';


const MainComponent = () => {
    const questions = useSelector((state: RootState) => state.interview.questions);
    const currentQuestionIndex = useSelector((state: RootState) => state.interview.currentQuestionIndex);
    const feedbacks = useSelector((state: RootState) => state.interview.feedbacks as string[]);
    const [inputValue, setInputValue] = React.useState<File | null>(null);
    const dispatch = useDispatch();
    const handleSubmit = (e:any) => {
        e.preventDefault();
        const formData = new FormData();
        if (inputValue) {
            formData.append('resume', inputValue);
        } else {
            console.error('No file selected');
        }

        dispatch(uploadResume(formData)); // שולחים את הפעולה ל-Redux
    };

    const handleFeedbackReceived = (feedback) => {
        // יש להוסיף את הפידבק ל-Redux (יש להוסיף reducer עבור פידבק)
    };

    return (
        <div>
            <h1>שאלות מהשרת</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setInputValue(e.target.files[0]);
                        }
                    }}
                />
                <button type="submit">שלח קורות חיים</button>
            </form>

            {currentQuestionIndex < questions.length && (
                <QuestionComponent
                    question={questions[currentQuestionIndex]}
                    onFeedbackReceived={handleFeedbackReceived}
                />
            )}

            {feedbacks.length > 0 && (
                <div>
                    <h3>משובים:</h3>
                    <ul>
                        {feedbacks.map((feedback: string, index: number) => (
                            <li key={index}>{feedback}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MainComponent;

