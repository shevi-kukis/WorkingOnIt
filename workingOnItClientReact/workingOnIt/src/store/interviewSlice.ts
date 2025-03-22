import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { interviewState } from '../models/interview';
import { StoreType } from './store';
import { useAuth } from '../components/AuthContext';



const API_PYTHON_BASE_URL = 'http://localhost:5000';

// export const uploadResume: any = createAsyncThunk(
//     'interview/uploadResume',
//     async (resumeFile: File) => {
//         const formData = new FormData();
//         formData.append('resume', resumeFile);
//         const response = await axios.post(`${API_PYTHON_BASE_URL}/upload_resume`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         // טיפול נכון בנתונים מהשרת
//         let arrayQuestions = [];
//         if (typeof response.data.questions === "string") {
//             try {
//                 arrayQuestions = JSON.parse(response.data.questions); 
//                 if (!Array.isArray(arrayQuestions)) {
//                     throw new Error("Response is not an array");
//                 }
//             } catch (error) {
//                 console.error("Error parsing JSON questions:", error);
//                 arrayQuestions = [];
//             }
//         } else if (Array.isArray(response.data.questions)) {
//             arrayQuestions = response.data.questions;
//         }

//         console.log("Parsed Questions:", arrayQuestions);
//         return arrayQuestions;
//     }
// );

export const uploadResume: any = createAsyncThunk(
    'interview/uploadResume',
    async (filePath: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_PYTHON_BASE_URL}/upload_resume`, { filePath });
            return response.data.questions;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error uploading resume');
        }
    }
);
// Async thunk to check answer
export const checkAnswer: any = createAsyncThunk(
    'interview/checkAnswer',
    async ({ question, answer }: { question: string; answer: string }) => {
        const response = await axios.post(`${API_PYTHON_BASE_URL}/check_answer`, {
            question,
            answer,
        });
        return response.data.feedback; // מחזירים את הפידבק
    }
);

// export const evaluateResponses: any = createAsyncThunk(
//     'interview/evaluateResponses',
//     async (feedbackList) => {
//         const response = await axios.post(`${API_PYTHON_BASE_URL}/evaluate_responses`, {
//             feedback_list: feedbackList,
//         });
//         return response.data; // מחזירים את הציון הממוצע ואת הסיכום
//     }
// );
export const evaluateResponses: any = createAsyncThunk(
    'interview/evaluateResponses',
    async (_, { getState }) => {
        const state: interviewState = (getState() as { interview: interviewState }).interview;
        const response = await axios.post(`${API_PYTHON_BASE_URL}/evaluate_responses`, {
            feedback_list: state.feedbacks,
        });
        return response.data; // מחזירים את הציון הממוצע ואת הסיכום
    }
);

// Define the interviewState interface


export const initialState: interviewState = {
    questions: [],
    currentQuestionIndex: 0,
    feedbacks: [],
    averageScore: null,
    summary: '',
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
}

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        resetInterview: (state) => {
            state.questions = [];
            state.currentQuestionIndex = 0;
            state.feedbacks = [];
        },
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex += 1; // עובר לשאלה הבאה רק אם לא הגענו לאחרונה
            } else {
                console.log("No more questions left.");
            }
        },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadResume.pending, (state) => {
                state.status = 'loading';
            })
            // .addCase(uploadResume.fulfilled, (state, action) => {
            //     state.status = 'succeeded';
            //     state.questions = action.payload;
            //     console.log( state.questions);
            //     // state.questions = action.payload.map((question: string) => question.replace(/["']/g, '').trim());
            //     // console.log(action.payload);

            // })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.status = 'succeeded';
            
                // חיתוך הרשימה כדי להסיר את האיבר הראשון והאחרון
                if (Array.isArray(action.payload) && action.payload.length > 1) {
                    state.questions = action.payload.slice(1, -1);
                } else {
                    state.questions = action.payload; // אם הרשימה ריקה או עם איבר אחד, נשמור אותה כמו שהיא
                }
            
                console.log(state.questions);
            })
            
            .addCase(uploadResume.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(checkAnswer.fulfilled, (state, action) => {
                state.feedbacks.push(action.payload);
            })
            .addCase(evaluateResponses.fulfilled, (state, action) => {
                state.averageScore = action.payload.average_score;
                state.summary = action.payload.summary;
            });
    },
});

export const { resetInterview, nextQuestion } = interviewSlice.actions;

export default interviewSlice.reducer;