
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { interviewState } from '../models/interview';


const API_PYTHON_BASE_URL = 'http://localhost:5000';

export const uploadResume: any = createAsyncThunk(
    'interview/uploadResume',
    async (filePath: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_PYTHON_BASE_URL}/upload_resume`, { filePath });
            return response.data.questions;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Error uploading resume');
        }
    }
);

export const checkAnswer: any = createAsyncThunk(
    'interview/checkAnswer',
    async ({ question, answer }: { question: string; answer: string }) => {
        const response = await axios.post(`${API_PYTHON_BASE_URL}/check_answer`, {
            question,
            answer,
        });
        return response.data.feedback;
    }
);

export const evaluateResponses: any = createAsyncThunk(
    'interview/evaluateResponses',
    async (_, { getState }) => {
        const state: interviewState = (getState() as { interview: interviewState }).interview;
        const response = await axios.post(`${API_PYTHON_BASE_URL}/evaluate_responses`, {
            feedback_list: state.feedbacks,
        });
        return response.data;
    }
);

export const initialState: interviewState = {
    questions: [],
    currentQuestionIndex: 0,
    feedbacks: [],
    averageScore: null,
    summary: '',
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
                        state.averageScore = action.payload.averageScore;
                        state.summary = action.payload.summary;
                        state.isInterviewFinished = true; // סימון שהראיון הסתיים
                    });
            }
            
});

export const { resetInterview, nextQuestion,addFeedback } = interviewSlice.actions;
export default interviewSlice.reducer;
