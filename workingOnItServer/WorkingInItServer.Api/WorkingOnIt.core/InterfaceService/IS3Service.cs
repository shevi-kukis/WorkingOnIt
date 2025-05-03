using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



namespace WorkingOnIt.Core.InterfaceService
{
        public interface IS3Service
        {

        // 🟢 יצירת URL חתום להעלאת קובץ
        public Task<string> GeneratePresignedUploadUrlAsync(string fileName, string contentType);


        // 🟢 העלאת קובץ ל-S3 ומחזיר URL חתום להורדה
        public Task<string> UploadFileAsync(IFormFile file);


        // 🟢 מחיקת קובץ מ-S3
        public Task DeleteFileAsync(string fileName);


        // 🟢 יצירת URL חתום להורדת קובץ
        public  Task<string> GeneratePresignedDownloadUrlAsync(string fileName);


        // 🟢 עדכון קובץ (מחיקת הישן והעלאת חדש)
        public  Task<string> UpdateFileAsync(IFormFile file, string oldFileName);
   
    }


}





