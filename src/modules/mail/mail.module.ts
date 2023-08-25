import { Module } from '@nestjs/common';
import {ConfigService} from '@nestjs/config'
import { MailService } from './service/mailer.service';
import { MailerController } from './controller/mailer.controller';

@Module({
    providers: [MailService,  ConfigService  ],
    controllers: [MailerController],
    exports: [MailService],

})
export class MailModule {}
