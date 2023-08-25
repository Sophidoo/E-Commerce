import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
@Injectable()
export class MailService {
    constructor(private readonly mailerService : MailerService, private readonly configService : ConfigService){}

    private async setTransport() {
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
          this.configService.get('CLIENT_ID'),
          this.configService.get('CLIENT_SECRET'),
          'https://developers.google.com/oauthplayground',
        );
    
        oauth2Client.setCredentials({
          refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken: string = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
              if (err) {
                reject('Failed to create access token');
              }
              resolve(token);
            });
          });

          const config: Options = {
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: this.configService.get('EMAIL'),
              clientId: this.configService.get('CLIENT_ID'),
              clientSecret: this.configService.get('CLIENT_SECRET'),
              accessToken,
            },
          };
          this.mailerService.addTransporter('gmail', config);
    }

    public async sendMail(email: string) {
        await this.setTransport();
        this.mailerService
          .sendMail({
            transporterName: 'gmail',
            to: email, // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: 'Verficiaction Code', // Subject line
            template: 'otp',
            context: {
              // Data to be sent to template engine..
              otp: '38320',
            },
          })
          .then((success) => {
            console.log(success);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    public async sendOtpMail(email: string, otp: string, subject: string, template: string, ) {
        await this.setTransport();
        console.log(email + " service")
        await this.mailerService
          .sendMail({
            transporterName: 'gmail',
            to: email, // list of receivers
            from: 'noreply@nestjs.com', // sender address
            subject: subject, // Subject line
            template: template,
            context: {
              // Data to be sent to template engine..
              otp: otp,
            },
          })
          .then((success) => {
            console.log(success);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
