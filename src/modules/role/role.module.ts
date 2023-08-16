import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PrismaService } from 'src/database/prisma.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService],
  imports: [PrismaModule]
})
export class RoleModule {}
