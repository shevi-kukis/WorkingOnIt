import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './interviewSlice'; // נתיב לקובץ interviewSlice

const store = configureStore({
    reducer: {
        interview: interviewReducer,
    },
});

// Define the type for the Redux store's state
export type StoreType = ReturnType<typeof store.getState>;

// Export the store
export default store;
