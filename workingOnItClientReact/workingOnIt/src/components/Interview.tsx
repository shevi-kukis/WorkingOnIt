// // import React, { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import Question from './Question';
// // import { checkAnswer, nextQuestion, uploadResume, evaluateResponses } from '../store/interviewSlice';
// // import { StoreType } from '../store/store';

// // const Interview = () => {
// //     const dispatch = useDispatch();
// //     const questions = useSelector((state: StoreType) => state.interview.questions);
// //     const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex);
// //     const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
// //     const averageScore = useSelector((state: StoreType) => state.interview.averageScore);
// //     const summary = useSelector((state: StoreType) => state.interview.summary);
// //     const [file, setFile] = React.useState('');

// //     const handleChange = (e) => {
// //         if (e.target.files && e.target.files[0]) {
// //             setFile(e.target.files[0]);
// //         }
// //     };

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         dispatch(uploadResume(file));
// //     };

// //     const handleFeedbackReceived = (feedback) => {
// //         dispatch(checkAnswer({ question: questions[currentQuestionIndex], answer: feedback }));
// //         dispatch(nextQuestion()); // מעדכן את currentQuestionIndex
// //     };

// //     useEffect(() => {
// //         if (feedbacks.length > 0) {
// //             // אחרי קבלת כל המשובים, אנו שולחים אותם להערכה
// //             dispatch(evaluateResponses(feedbacks));
// //         }
// //     }, [feedbacks, dispatch]);

// //     return (
// //         <div>
// //             <h1>שאלות מהשרת</h1>
// //             <form onSubmit={handleSubmit}>
// //                 <input
// //                     type="file"
// //                     accept=".pdf"
// //                     onChange={handleChange}
// //                 />
// //                 <button type="submit">שלח קורות חיים</button>
// //             </form>

// //             {currentQuestionIndex < questions.length - 1 && (
// //                 <Question
// //                     question={questions[currentQuestionIndex]}
// //                     onFeedbackReceived={handleFeedbackReceived}
// //                 />
// //             )}

// //             {currentQuestionIndex === questions.length - 1 && feedbacks.length > 0 && (
// //                 <div>
// //                     <h2>המשוב הכללי</h2>
// //                     <p>ציון ממוצע: {averageScore}</p>
// //                     <p>סיכום: {summary}</p>
// //                     <h3>משובים לכל השאלות:</h3>
// //                     <ul>
// //                         {feedbacks.map((feedback, index) => (
// //                             <li key={index}>{feedback}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default Interview;
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Question from './Question';
// import { checkAnswer, nextQuestion, uploadResume, evaluateResponses } from '../store/interviewSlice';
// import { StoreType } from '../store/store';
// import { useAuth } from './AuthContext';


// const Interview = () => {
//     const dispatch = useDispatch();
//     const { state } = useAuth(); // Get the context state
//     const questions = useSelector((state: StoreType) => state.interview.questions);
//     const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex);
//     const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
//     const averageScore = useSelector((state: StoreType) => state.interview.averageScore);
//     const summary = useSelector((state: StoreType) => state.interview.summary);
//     const resumeFilePath = state.resume?.filePath; // קבלת ה-path של קובץ קורות החיים מתוך ה-context

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (resumeFilePath) {
//             dispatch(uploadResume(resumeFilePath)); // שליחה של ה-path במקום קובץ
//         }
//     };

//     const handleFeedbackReceived = (feedback) => {
//         dispatch(checkAnswer({ question: questions[currentQuestionIndex], answer: feedback }));
//         dispatch(nextQuestion()); // מעדכן את currentQuestionIndex
//     };

//     useEffect(() => {
//         if (feedbacks.length > 0) {
//             // אחרי קבלת כל המשובים, אנו שולחים אותם להערכה
//             dispatch(evaluateResponses(feedbacks));
//         }
//     }, [feedbacks, dispatch]);

//     return (
//         <div>
//             <h1>שאלות מהשרת</h1>
//             {/* נוודא שלא נציג כפתור העלאת קובץ */}
//             {resumeFilePath ? (
//                 <div>
//                     <p>קובץ קורות החיים כבר הועלה. לא צריך להעלות מחדש.</p>
//                     <button onClick={handleSubmit}>שלח קורות חיים</button>
//                 </div>
//             ) : (
//                 <p>אין קובץ קורות חיים זמין.</p>
//             )}

//             {currentQuestionIndex < questions.length - 1 && (
//                 <Question
//                     question={questions[currentQuestionIndex]}
//                     onFeedbackReceived={handleFeedbackReceived}
//                 />
//             )}

//             {currentQuestionIndex === questions.length - 1 && feedbacks.length > 0 && (
//                 <div>
//                     <h2>המשוב הכללי</h2>
//                     <p>ציון ממוצע: {averageScore}</p>
//                     <p>סיכום: {summary}</p>
//                     <h3>משובים לכל השאלות:</h3>
//                     <ul>
//                         {feedbacks.map((feedback, index) => (
//                             <li key={index}>{feedback}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Interview;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import Question from './Question';
import { checkAnswer, nextQuestion, uploadResume } from '../store/interviewSlice';
import { StoreType } from '../store/store';

const Interview = () => {
    const dispatch = useDispatch();
    const { state } = useAuth();
    const questions = useSelector((state: StoreType) => state.interview.questions);
    const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex);
    const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
    const filePath="https://www.eurolux.co.il/Media/Doc/%D7%90%D7%95%D7%93%D7%95%D7%AA/%D7%A7%D7%95%D7%91%D7%A5%20%D7%9C%D7%93%D7%95%D7%92%D7%9E%D7%90.pdf";
    // const filePath = state.resume?.filePath; // קבלת filePath מתוך ה-Context
     useEffect(() => {
        if (state.resume?.filePath) {
            dispatch(uploadResume(filePath)); // שליחה ל-Redux עם ה-filePath
        }
    }, [state.resume?.filePath, dispatch]); // תלות ב-filePath בתוך state.resume
    

    const handleFeedbackReceived = (feedback) => {
        dispatch(checkAnswer({ question: questions[currentQuestionIndex], answer: feedback }));
        dispatch(nextQuestion()); // מעדכן את currentQuestionIndex
    };

    return (
        <div>
            <h1>שאלות מהשרת</h1>

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
