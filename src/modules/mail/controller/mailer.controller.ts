import { Controller, Get, Param, Query } from '@nestjs/common';
import { MailService } from '../service/mailer.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('mailer')
export class MailerController {
    constructor(private readonly mailService : MailService){}

    @Public()
    @Get()
    sendEmail(@Query('email') email : string) {
        console.log(email + " controller")
        return this.mailService.sendMail(email)
    }
}
