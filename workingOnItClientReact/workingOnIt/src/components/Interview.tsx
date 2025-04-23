import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthContext';
import Question from './Question';
import {
  checkAnswer,
  nextQuestion,
  addFeedback,
  uploadResume,
  evaluateResponses
} from '../store/interviewSlice';
import { StoreType } from '../store/store';
import { motion, AnimatePresence } from 'framer-motion';


const Interview = () => {
  const dispatch = useDispatch();
  const { state } = useAuth();

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [openFeedbackIndexes, setOpenFeedbackIndexes] = useState<number[]>([]);

  const questions = useSelector((state: StoreType) => state.interview.questions);
  const currentQuestionIndex = useSelector((state: StoreType) => state.interview.currentQuestionIndex);
  const isInterviewFinished = useSelector((state: StoreType) => state.interview.isInterviewFinished);
  const feedbacks = useSelector((state: StoreType) => state.interview.feedbacks);
  const averageScore = useSelector((state: StoreType) => state.interview.averageScore);
  const summary = useSelector((state: StoreType) => state.interview.summary);

  const resumeFilePath = state.resume?.filePath;

  useEffect(() => {
    console.log("Average Score:", averageScore);
  }, [averageScore]);

  useEffect(() => {
    if (resumeFilePath && interviewStarted) {
      dispatch(uploadResume(resumeFilePath));
    }
  }, [resumeFilePath, interviewStarted]);

  const handleFeedbackReceived = async (feedback: string) => {
    const question = questions[currentQuestionIndex];
    try {
      const response = await dispatch(checkAnswer({ question, answer: feedback })).unwrap();
      dispatch(addFeedback(response));
    } catch (error) {
      console.error("Error in checkAnswer:", error);
    }

    const isLastQuestion = currentQuestionIndex >= questions.length - 1;
    if (isLastQuestion) {
      dispatch(evaluateResponses());
    } else {
      dispatch(nextQuestion());
    }
  };

  const toggleFeedback = (index: number) => {
    setOpenFeedbackIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!interviewStarted) {
    return (
        
      <div className="text-center text-gray-900 mt-20">
        <h1 className="text-3xl font-bold mb-4">סימולציית ראיון עבודה</h1>
        <p className="mb-6">כדי להתחיל את הראיון, לחצי על הכפתור הבא:</p>
        <button
          onClick={() => setInterviewStarted(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          🚀 התחל ראיון
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="text-gray-900 text-center mt-10">🔄 טוען שאלות... אנא המתיני</div>;
  }

  return (
    <div className="text-black !text-black bg-white">
    <div className="max-w-2xl mx-auto mt-24 text-gray-900 px-4">
      <AnimatePresence mode="wait">
        {!isInterviewFinished && currentQuestionIndex < questions.length ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            <Question
              question={questions[currentQuestionIndex]}
              onFeedbackReceived={handleFeedbackReceived}
            />
          </motion.div>
        ) : (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
          >
          <h1>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor molestiae eligendi molestias,
             harum ducimus assumenda consequatur eaque corrupti odio amet culpa placeat
            , fugiat pariatur dicta saepe sunt porro nemo mollitia.
           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor molestiae eligendi molestias,
             harum ducimus assumenda consequatur eaque corrupti odio amet culpa placeat
            , fugiat pariatur dicta saepe sunt porro nemo mollitia
           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor molestiae eligendi molestias,
             harum ducimus assumenda consequatur eaque corrupti odio amet culpa placeat
            , fugiat pariatur dicta saepe sunt porro nemo mollitia.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nostrum, veritatis 
            aliquam? Dignissimos quia, delectus quod animi magnam nobis suscipit ducimus possimus! Laboriosam e
            a non, quo mollitia similique optio nesciunt possimus?</h1>
              {/* Debugging: console.log("Average Score:", averageScore) */}
            <h2 className="text-2xl font-bold mb-4">✨ המשוב הכללי</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p><strong>ציון ממוצע:</strong> {averageScore}</p>
              {console.log("Average Score:", averageScore)}
              <p><strong>סיכום:</strong> {summary}</p>
            </div>

            <h3 className="text-xl font-semibold mb-2">📝 משובים לשאלות:</h3>
            <ul className="space-y-4">
              {questions.map((q, index) => (
                <li key={index} className="border p-4 rounded-lg bg-white text-gray-900 shadow">
                  <p className="font-bold">שאלה {index + 1}: {q}</p>
                  <button
                    onClick={() => toggleFeedback(index)}
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    {openFeedbackIndexes.includes(index) ? 'הסתר משוב' : 'הצג משוב'}
                  </button>
                  <AnimatePresence>
                    {openFeedbackIndexes.includes(index) && feedbacks[index] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 bg-gray-100 text-gray-900 p-3 rounded"
                      >
                        <p><strong>ציון:</strong> {feedbacks[index].score}</p>
                        <p><strong>תשובה נכונה:</strong> {feedbacks[index].correct ? '✅ נכון' : '❌ לא נכון'}</p>
                        <p><strong>תשובה שהייתה אמורה להינתן:</strong> {feedbacks[index].correct_answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
};

export default Interview;
