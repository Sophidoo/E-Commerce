import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { PrismaService } from 'src/database/prisma.service';
import { ProductController } from './controller/product.controller';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [PrismaModule]
})
export class ProductModule {}
