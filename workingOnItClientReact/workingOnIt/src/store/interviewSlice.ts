import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to upload resume and fetch questions
export const uploadResume:any = createAsyncThunk(
    'interview/uploadResume',
    async (resumeFile: Blob | string) => {
        const formData = new FormData();
        formData.append('resume', resumeFile);

        const response = await axios.post('http://localhost:5000/upload_resume', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.questions; // מחזירים את השאלות
    }
);

// Async thunk to check answer
export const checkAnswer:any = createAsyncThunk(
    'interview/checkAnswer',
    async ({ question, answer }: { question: string; answer: string }) => {
        const response = await axios.post('http://localhost:5000/check_answer', {
            question,
            answer,
        });
        return response.data.feedback; // מחזירים את הפידבק
    }
);

const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        questions: [],
        currentQuestionIndex: 0,
        feedbacks: [] as string[], // Assuming feedbacks are strings; adjust type if needed
        averageScore: null,
        summary: '',
        status: 'idle', // idle | loading | succeeded | failed
        error: null,
    },
    
    reducers: {
        resetInterview: (state) => {
            state.questions = [];
            state.currentQuestionIndex = 0;
            state.feedbacks = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadResume.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadResume.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.questions = action.payload;
            })
            .addCase(uploadResume.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(checkAnswer.fulfilled, (state, action) => {
                state.feedbacks.push(action.payload);
            });
    },
});

export const { resetInterview } = interviewSlice.actions;

export default interviewSlice.reducer;
