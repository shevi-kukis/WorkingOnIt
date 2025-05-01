

using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using Recipes.Service.Services;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service()
    {
        var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID")
            ?? throw new Exception("AWS_ACCESS_KEY_ID is not set");
        var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY")
            ?? throw new Exception("AWS_SECRET_ACCESS_KEY is not set");
        var region = Environment.GetEnvironmentVariable("AWS_REGION")
            ?? throw new Exception("AWS_REGION is not set");
        _bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME")
            ?? throw new Exception("AWS_BUCKET_NAME is not set");

        _s3Client = new AmazonS3Client(accessKey, secretKey, Amazon.RegionEndpoint.GetBySystemName(region));
    }

    // 🟢 יצירת URL חתום להעלאת קובץ
    public async Task<string> GeneratePresignedUploadUrlAsync(string fileName, string contentType)
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

    // 🟢 העלאת קובץ ל-S3 ומחזיר URL חתום להורדה
    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        using (var stream = file.OpenReadStream())
        {
            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                InputStream = stream,
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest);
        }

        // מחזיר URL חתום להורדה (במקום URL ישיר)
        return await GeneratePresignedDownloadUrlAsync(fileName);
    }

    // 🟢 מחיקת קובץ מ-S3
    public async Task DeleteFileAsync(string fileName)
    {
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileName
        };

        await _s3Client.DeleteObjectAsync(deleteRequest);
    }

    // 🟢 יצירת URL חתום להורדת קובץ
    public async Task<string> GeneratePresignedDownloadUrlAsync(string fileName)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = fileName,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddDays(7) // תוקף של 7 ימים

        };

        return _s3Client.GetPreSignedURL(request);
    }

    // 🟢 עדכון קובץ (מחיקת הישן והעלאת חדש)
    public async Task<string> UpdateFileAsync(IFormFile file, string oldFileName)
    {
        if (!string.IsNullOrEmpty(oldFileName))
        {
            await DeleteFileAsync(oldFileName);
        }

        return await UploadFileAsync(file);
    }
}

