import { Module } from '@nestjs/common';
import { CartService } from './service/cart.service';
import { CartController } from './controller/cart.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  providers: [CartService],
  controllers: [CartController],
  imports: [PrismaModule]
})
export class CartModule {}
