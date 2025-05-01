export interface interviewState {
    questions: string[];
    currentQuestionIndex: number;
    feedbacks: string[];
    summary: string[][];
  
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    isInterviewFinished: boolean;
}