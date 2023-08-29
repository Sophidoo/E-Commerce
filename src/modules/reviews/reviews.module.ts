import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsService } from './service/reviews.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [PrismaModule]
})
export class ReviewsModule {}
