import { Controller, Get, Param, Query } from '@nestjs/common';
import { MailService } from '../service/mailer.service';
import { Public } from 'src/decorator/public.decorator';
import { Subject } from 'rxjs';
import { Roles } from 'src/decorator/roles.decorator';
import { RoleType } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mailer')
export class MailerController {
    constructor(private readonly mailService : MailService){}

    @Public()
    @Get()
    sendEmail(@Query('email') email : string, @Query('subject') subject: string, @Query('data') data: string) {
        console.log(email + " controller")
        return this.mailService.sendMail(email, subject, data)
    }

    @Get('/all')
    @Roles(RoleType.ADMIN)
    sendToAll(@Query('subject') subject: string, @Query('data') data: string){
        return this.mailService.sendMailToAll(subject, data)
    }
}
