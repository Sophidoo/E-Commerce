import { Module } from '@nestjs/common';
import { ProductService } from './service/product.service';
import { PrismaService } from 'src/database/prisma.service';
import { ProductController } from './controller/product.controller';
import { PrismaModule } from 'src/database/prisma.module';
import { CloudinaryService } from 'src/config/cloudinary.service';
import { MulterModule } from '@nestjs/platform-express';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/service/audit.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService, AuditService],
  imports: [PrismaModule, AuditModule,
    MulterModule.register({
      dest: './uploads', // Set your desired upload directory
    })]
})
export class ProductModule {}
