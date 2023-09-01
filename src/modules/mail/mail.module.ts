import { Module } from '@nestjs/common';
import {ConfigService} from '@nestjs/config'
import { MailService } from './service/mailer.service';
import { MailerController } from './controller/mailer.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
    providers: [MailService,  ConfigService  ],
    controllers: [MailerController],
    exports: [MailService],
    imports: [PrismaModule]

})
export class MailModule {}
