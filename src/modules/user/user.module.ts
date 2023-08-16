import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaModule } from 'src/database/prisma.module';
import { RoleModule } from '../role/role.module';
import { RoleService } from '../role/role.service';

@Module({
    controllers: [AuthController],
    providers: [AuthService, RoleService],
    imports: [PrismaModule]
})

export class UserModule {}
