import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';
import { AdminService } from './service/admin.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
    providers: [AdminService],
    controllers: [AdminController],
    imports: [PrismaModule]
})
export class AdminModule {}
