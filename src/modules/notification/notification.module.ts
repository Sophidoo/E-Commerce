import { Module } from '@nestjs/common';
import { NoificationService } from './service/noification.service';
import { NotificationController } from './controller/notification.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [NoificationService],
  controllers: [NotificationController],
  imports: [PrismaModule]
})
export class NotificationModule {}
