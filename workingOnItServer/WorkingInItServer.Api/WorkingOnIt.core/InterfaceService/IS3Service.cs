using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;



    namespace Recipes.Service.Services
    {
        public interface IS3Service
        {
         public   Task<string> GeneratePresignedUrlAsync(string fileName, string contentType);
          public  Task<string> GetDownloadUrlAsync(string fileName);
        public Task<string> UploadFileAsync(IFormFile file);
    

        public  Task<string> UpdateFileAsync(IFormFile file, string currentFilePath);


        public  Task DeleteFileAsync(string filePath);
   
    }
}




