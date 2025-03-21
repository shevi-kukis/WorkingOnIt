import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './interviewSlice'; // נתיב לקובץ interviewSlice

const store = configureStore({
    reducer: {
        interview: interviewReducer,
    },
});

export default store;
