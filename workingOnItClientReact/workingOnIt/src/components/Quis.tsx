// import React, { useState } from 'react';
// import axios from 'axios';

// function App() {
//   const [resume, setResume] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [question, setQuestion] = useState('');
//   const [answer, setAnswer] = useState('');
//   const [feedback, setFeedback] = useState('');

//   const handleFileChange = (e) => {
//     setResume(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     const formData = new FormData();
//     formData.append('resume', resume);

//     try {
//       const response = await axios.post('http://localhost:5000/upload_resume', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       setQuestions(response.data.questions);
//     } catch (error) {
//       console.error('Error uploading resume:', error);
//     }
//   };

//   const handleCheckAnswer = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/check_answer', {
//         question,
//         answer,
//       });
//       setFeedback(response.data.feedback);
//     } catch (error) {
//       console.error('Error checking answer:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Resume Analyzer</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={handleUpload}>Upload Resume</button>

//       {questions.length > 0 && (
//         <div>
//           <h2>Questions from Resume:</h2>
//           <ul>
//             {questions.split('\n').map((q, index) => (
//               <li key={index}>{q}</li>
//             ))}
//           </ul>
//           <input
//             type="text"
//             placeholder="Enter your question"
//             value={question}
//             onChange={(e) => setQuestion(e.target.value)}
//           />
//           <input
//             type="text"
//             placeholder="Enter your answer"
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//           />
//           <button onClick={handleCheckAnswer}>Check Answer</button>
//         </div>
//       )}

//       {feedback && <div><h3>Feedback: {feedback}</h3></div>}
//     </div>
//   );
// }

// export default App;
