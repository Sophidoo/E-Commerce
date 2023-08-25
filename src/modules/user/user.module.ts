import { Module } from '@nestjs/common';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { GoogleStrategyService } from './auth/service/google-strategy.service';
import { GoogleStrategyController } from './auth/controller/google-strategy.controller';

@Module({
    controllers: [AuthController, GoogleStrategyController],
    providers: [AuthService, GoogleStrategyService],
    imports: [PrismaModule, OtpModule, MailModule]
})

export class UserModule {}
