"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const googleapis_1 = require("googleapis");
const prisma_service_1 = require("../../../database/prisma.service");
let MailService = class MailService {
    constructor(mailerService, configService, prismaService) {
        this.mailerService = mailerService;
        this.configService = configService;
        this.prismaService = prismaService;
    }
    async setTransport() {
        const OAuth2 = googleapis_1.google.auth.OAuth2;
        const oauth2Client = new OAuth2(this.configService.get('CLIENT_ID'), this.configService.get('CLIENT_SECRET'), 'https://developers.google.com/oauthplayground');
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });
        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token');
                }
                resolve(token);
            });
        });
        const config = {
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
    async sendMail(email, subject, data) {
        await this.setTransport();
        this.mailerService
            .sendMail({
            transporterName: 'gmail',
            to: email,
            from: 'noreply@nestjs.com',
            subject: subject,
            template: 'otp',
            context: {
                data: data,
            },
        })
            .then((success) => {
            console.log(success);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    async sendMailToAll(subject, data) {
        const users = await this.prismaService.user.findMany({
            where: {
                AND: {
                    isBlocked: {
                        not: true
                    },
                    isVerified: true
                }
            }
        });
        const emails = [];
        users.map(user => {
            emails.push(user.email);
        });
        await this.setTransport();
        this.mailerService
            .sendMail({
            transporterName: 'gmail',
            to: emails,
            from: 'noreply@nestjs.com',
            subject: subject,
            template: 'otp',
            context: {
                data: data,
            },
        })
            .then((success) => {
            console.log(success);
        })
            .catch((err) => {
            console.log(err);
        });
    }
    async sendOtpMail(email, otp, subject, template) {
        await this.setTransport();
        console.log(email + " service");
        await this.mailerService
            .sendMail({
            transporterName: 'gmail',
            to: email,
            from: 'noreply@nestjs.com',
            subject: subject,
            template: template,
            context: {
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
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService, config_1.ConfigService, prisma_service_1.PrismaService])
], MailService);
exports.MailService = MailService;
//# sourceMappingURL=mailer.service.js.map