import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";

interface FileDownloaderProps {
  fileName: string; // שם הקובץ
  contentType: string; // סוג הקובץ (למשל image/png, application/pdf)
}

const FileUploader: React.FC<FileDownloaderProps> = ({ fileName, contentType }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

//   const handleDownload = async () => {
//     try {
//         const response = await axios.get(`/api/download-url/${contentType}`);
//         setFileUrl(response.data);
//     } catch (error) {
//         console.error("שגיאה בהורדה:", error);
//     }
// };
const handleDownload = async () => {


  try {
    // בקשת Presigned URL להורדה
    const response = await axios.get('/api/download-url', {
      params: {
        Bucket: 'resumesfiles',
        Key: `resumes/${fileName}`, // הנתיב המלא בתוך ה-Bucket
        Expires: 60,
      }
    });

    const downloadUrl = response.data.url;
    
    // פתיחת הקובץ ישירות מה-S3
    window.location.href = downloadUrl;

  } catch (error) {
    console.error('שגיאה בהורדה:', error);
  }
};

// const handleDownload = async () => {
//   if (!fileUrl) return;
  
//   try {
//     const response = await axios.get('/api/download-url', {
//       params: { fileName: file?.name }
//     });

//     const downloadUrl = response.data.url;
//     window.location.href = downloadUrl;
//   } catch (error) {
//     console.error('שגיאה בהורדה:', error);
//   }
// };
  return (
    <div>
      <button onClick={handleDownload}>הורד קובץ</button>
      
      {/* הצגת הקישור להורדה */}
      {fileUrl && (
        <div>
          <h3>הקובץ להורדה:</h3>
     
            <img src={fileUrl} alt="Uploaded file" style={{ maxWidth: "300px", marginTop: "10px" }} />
          
    
          
        </div>
      )}
    </div>
  );
};

export default FileUploader;
