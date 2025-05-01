
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { interviewState } from '../models/interview';
import axiosInstance from '../components/axiosInstance';




export const uploadResume: any = createAsyncThunk(
    'interview/uploadResume',
    async (filePath: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/Resume/analyze`, { filePath });
            return response.data.questions;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Error uploading resume');
        }
    }
);

export const checkAnswer: any = createAsyncThunk(
    'interview/checkAnswer',
    async ({ question, answer }: { question: string; answer: string }) => {
        const response = await axiosInstance.post(`/InterviewQuestions/check`, {
            question,
            answer,
        });

        return {
            ...response.data.feedback,
            userAnswer: answer  // ✅ נשמור את תשובת המשתמש
        };
    }
);


export const evaluateResponses: any = createAsyncThunk(
    'interview/evaluateResponses',
    async (_, { getState }) => {
        const state: interviewState = (getState() as { interview: interviewState }).interview;

        // const feedbackTexts = state; // ✅ חילוץ מחרוזות בלבד
        console.log("state.feedbacks:", state.feedbacks); // לבדיקה
        const feedbackTexts = state.feedbacks.map(f => 
            `Correct: ${f.correct}, Correct Answer: ${f.correct_answer}, Score: ${f.score}`
          );
          
        console.log("sending to server:", feedbackTexts); // לבדיקה

        const response = await axiosInstance.post(`/InterviewQuestions/evaluate`, {
            feedback_list: feedbackTexts,
        });
     console.log("response from server:", response.data); // לבדיקה
        return response.data;
    }
);


export const initialState: interviewState = {
    questions: [],
    currentQuestionIndex: 0,
    feedbacks: [],

    summary: [[]],
    status: 'idle',
    error: null,
    isInterviewFinished: false, // ✅ משתנה חדש לזיהוי סוף הראיון
};

const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        resetInterview: (state) => {
         
            state.questions = [];
            state.currentQuestionIndex = 0;
            state.feedbacks = [];
            state.isInterviewFinished = false;
        },
        nextQuestion: (state) => {
            if (state.currentQuestionIndex < state.questions.length - 1) {
                state.currentQuestionIndex += 1;
            } else {
                state.isInterviewFinished = true;
            }
        },
        addFeedback: (state, action) => {
            state.feedbacks.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.questions = action.payload;
                state.currentQuestionIndex = 0;
            })
            .addCase(checkAnswer.fulfilled, (state, action) => {
                state.feedbacks.push(action.payload);
            })
     
            .addCase(evaluateResponses.fulfilled, (state, action) => {
              
                const summary = action.payload.summary;
                if (Array.isArray(summary)) {
                    state.summary = Array.isArray(summary) ? summary : [[]];
                } else {
                    state.summary = [[]];
                }
                
            
                state.isInterviewFinished = true;
            });
            
            }
            
});

export const { resetInterview, nextQuestion,addFeedback } = interviewSlice.actions;
export default interviewSlice.reducer;
