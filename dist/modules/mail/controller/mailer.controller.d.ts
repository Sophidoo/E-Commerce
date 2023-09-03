import { MailService } from '../service/mailer.service';
export declare class MailerController {
    private readonly mailService;
    constructor(mailService: MailService);
    sendEmail(email: string, subject: string, data: string): Promise<void>;
    sendToAll(subject: string, data: string): Promise<void>;
}
