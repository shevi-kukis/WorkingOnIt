export interface interviewState {
    questions: string[];
    currentQuestionIndex: number;
    feedbacks: string[];
    averageScore: number | null;
    summary: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}