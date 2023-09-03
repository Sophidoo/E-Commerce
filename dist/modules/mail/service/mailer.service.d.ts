import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/database/prisma.service';
export declare class MailService {
    private readonly mailerService;
    private readonly configService;
    private readonly prismaService;
    constructor(mailerService: MailerService, configService: ConfigService, prismaService: PrismaService);
    private setTransport;
    sendMail(email: string, subject: string, data: string): Promise<void>;
    sendMailToAll(subject: string, data: string): Promise<void>;
    sendOtpMail(email: string, otp: string, subject: string, template: string): Promise<void>;
}
