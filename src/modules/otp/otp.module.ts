import { Module } from '@nestjs/common';
import { OtpController } from './controller/otp.controller';
import { OtpService } from './service/otp.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
  imports: [PrismaModule]
})
export class OtpModule {}
