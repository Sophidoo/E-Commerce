import { Module } from '@nestjs/common';
import { AuthController } from './auth/controller/auth.controller';
import { AuthService } from './auth/service/auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { OtpModule } from '../otp/otp.module';
import { MailModule } from '../mail/mail.module';
import { GoogleStrategyService } from './auth/service/google-strategy.service';
import { GoogleStrategyController } from './auth/controller/google-strategy.controller';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    controllers: [AuthController, GoogleStrategyController],
    providers: [AuthService, GoogleStrategyService, CloudinaryService],
    imports: [PrismaModule, OtpModule, MailModule, MulterModule.register({
        dest: "/profile"
    })]
})

export class UserModule {}
