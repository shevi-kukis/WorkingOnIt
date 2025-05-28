﻿using Microsoft.EntityFrameworkCore;
using WorkingOnIt.Core;
using WorkingOnIt.Core.InterfaceRepository;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Data;
using WorkingOnIt.Data.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using dotenv.net;
using WorkingOnIt.Service.Services;
using WorkingOnIt.Core.ModalsDto;





internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        DotEnv.Load();
        //Env.Load(); 
        //string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
        string jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new Exception("JWT_SECRET is not set");

        string awsAccessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
        string awsSecretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
        string awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");
        string bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");

        var smtpSettings = new SmtpSettings
        {
            Server = Environment.GetEnvironmentVariable("SMTP_SERVER"),
            Port = int.Parse(Environment.GetEnvironmentVariable("SMTP_PORT") ?? "587"),
            Username = Environment.GetEnvironmentVariable("SMTP_USERNAME"),
            Password = Environment.GetEnvironmentVariable("SMTP_PASSWORD")
        };

        builder.Services.AddSingleton(smtpSettings);
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IInterviewQuestionsService, InterviewQuestionsService>();
        builder.Services.AddScoped<IInterviewService, InterviewService>();
        builder.Services.AddScoped<IResumeService, ResumeService>();
        builder.Services.AddScoped<IRoleService, RoleService>();
        builder.Services.AddScoped<IEmailService, EmailService>();
        builder.Services.AddScoped<IAuthService, AuthService>();

        builder.Services.AddScoped<IUserRepository, UserRepository>();
        builder.Services.AddScoped<IRoleRepository, RoleRepository>();

        builder.Services.AddScoped<IInterviewQuestionsRepository, InterviewQuestionsRepository>();
        builder.Services.AddScoped<IInterviewRepository, InterviewRepository>();
        builder.Services.AddScoped<IResumeRepository, ResumeRepository>();


        builder.Services.AddControllers()   
          
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);

        builder.Services.AddScoped(typeof(IRepositoryManager), typeof(RepositoryManager));
        builder.Services.AddScoped(typeof(IRepositoryGeneric<>), typeof(RepositoryGeneric<>));

        builder.Services.AddAutoMapper(typeof(MappingProfile));
        builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

        builder.Services.AddSingleton<IS3Service, S3Service>(); // רישום ה-S3Service
        builder.Services.AddScoped<JwtService>();
        var connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION_STRING");
        builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
    mysqlOptions => mysqlOptions.CommandTimeout(60)));
        //  builder.Services.AddDbContext<DataContext>(options =>
        //options.UseMySql("Server=bhlraqx5nvyxmpm5cicv-mysql.services.clever-cloud.com;Database=bhlraqx5nvyxmpm5cicv;User=ua67fticoup8ufvo;Password=eB0GEfKtrMmgTdEjQExt; Integrated Security = true;TrustServerCertificate=True; ",
        //  new MySqlServerVersion(new Version(8, 0, 0))));
        //  builder.Services.AddDbContext<DataContext>(
        //options => options.UseSqlServer("Data Source = DESKTOP-SSNMLFD; Initial Catalog = WorkingOnIt; Integrated Security = true;TrustServerCertificate=True; "));
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins(
                     "http://localhost:5173",
                       "https://localhost:5173",
                    "https://workingonit.onrender.com",
                   "http://localhost:4200",
                       "https://localhost:4200",
                       "https://workingonitmanager.onrender.com"
                 )
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        //jwt extensions
        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
            options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("User", "Admin"));
            options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
        });

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddHttpClient();


        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)), // ✅ משתמש במפתח מה-ENV
                ValidateIssuer = false,
                ValidateAudience = false
            };
        });

        var app = builder.Build();
        app.UseCors("AllowFrontend");

        app.UseAuthentication(); // להוסיף לפני `app.UseAuthorization();`
        app.UseAuthorization();




       

  

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        app.MapControllers();

        app.Run();
    }
}