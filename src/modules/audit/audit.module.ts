import { Module } from '@nestjs/common';
import { AuditController } from './controller/audit.controller';
import { AuditService } from './service/audit.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  imports: [PrismaModule]
})
export class AuditModule {}
