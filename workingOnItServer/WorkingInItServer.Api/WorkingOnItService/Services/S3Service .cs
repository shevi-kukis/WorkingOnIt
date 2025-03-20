using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using Recipes.Service.Services;

public class S3Service:IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service()
    {
        // טוען משתנים מקובץ ה-ENV (למשל קובץ .env)
        var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? throw new Exception("AWS_ACCESS_KEY_ID is not set");
        var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? throw new Exception("AWS_SECRET_ACCESS_KEY is not set");
        var region = Environment.GetEnvironmentVariable("AWS_REGION") ?? throw new Exception("AWS_REGION is not set");
        _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME") ?? throw new Exception("AWS_BUCKET_NAME is not set");

        // יצירת האובייקט AmazonS3Client עם המידע שהתקבל מ-ENV
        _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
    }

    // פונקציה ליצירת URL חתום להעלאת קובץ
    public async Task<string> GeneratePresignedUrlAsync(string fileName, string contentType)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(10),
            ContentType = contentType
        };

        return _s3Client.GetPreSignedURL(request);
    }

    // פונקציה להעלאת קובץ ל-S3
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = "resumes/" + fileName; // תיקיית קורות חיים ב-S3

        using (var stream = file.OpenReadStream())
        {
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = filePath,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest);
        }

        return filePath;
    }

    // פונקציה לעדכון קובץ (מחיקת קובץ קודם והעלאת חדש)
    public async Task<string> UpdateFileAsync(IFormFile file, string currentFilePath)
    {
        // מחיקת הקובץ הקודם מ-S3
        await DeleteFileAsync(currentFilePath);

        // העלאת קובץ חדש
        return await UploadFileAsync(file);
    }

    // פונקציה למחיקת קובץ מ-S3
    public async Task DeleteFileAsync(string filePath)
    {
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = filePath
        };

        await _s3Client.DeleteObjectAsync(deleteRequest);
    }
    public async Task<string> GetDownloadUrlAsync(string filePath)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = filePath, // כאן אנחנו משתמשים בנתיב המלא של הקובץ ב-S3
            Verb = HttpVerb.GET, // בקשה מסוג GET (הורדה)
            Expires = DateTime.UtcNow.AddMinutes(30) // תוקף URL של 30 דקות
        };

        return _s3Client.GetPreSignedURL(request); // מחזיר את ה-URL החתום
    }
}
