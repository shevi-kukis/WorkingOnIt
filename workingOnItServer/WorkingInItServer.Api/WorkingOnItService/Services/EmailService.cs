using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using WorkingOnIt.Core.InterfaceService;
using WorkingOnIt.Core.ModalsDto;
namespace WorkingOnIt.Service.Services
{
  

    public class EmailService: IEmailService
    {
        private readonly SmtpSettings _smtp;

        public EmailService(SmtpSettings smtpSettings)
        {
            _smtp = smtpSettings;
        }
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            using var client = new System.Net.Mail.SmtpClient(_smtp.Server, _smtp.Port)
            {
                Credentials = new NetworkCredential(_smtp.Username, _smtp.Password),
                EnableSsl = true
            };

            var message = new MailMessage(_smtp.Username, to, subject, body);
            await client.SendMailAsync(message);
        }
    }

}
