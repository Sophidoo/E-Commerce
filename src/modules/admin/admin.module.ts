import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
    providers: [AdminService],
    controllers: [AdminController],
    imports: [PrismaService]
})
export class AdminModule {}
