import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './service/reviews.service';
import { PrismaModule } from 'src/database/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/service/audit.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, AuditService],
  imports: [PrismaModule]
})
export class ReviewsModule {}
