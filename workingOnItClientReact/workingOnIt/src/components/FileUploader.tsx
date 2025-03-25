import React from 'react';

const DownloadResume = ({ resumeUrl }: { resumeUrl: string }) => {
  const handleDownload = () => {
    if (!resumeUrl) {
      console.error("No resume URL provided.");
      return;
    }

    // יצירת קישור הורדה ולחיצה עליו אוטומטית
    const link = document.createElement('a');
    link.href = resumeUrl; // ה-URL המלא שמגיע מה-DB
    link.download = 'resume.pdf'; // שם קובץ ברירת מחדל
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return <button onClick={handleDownload}>Download Resume</button>;
};

export default DownloadResume;
