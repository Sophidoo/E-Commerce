import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [UserModule],
  controllers: [AppController],
  providers: [AppService, {
     provide: APP_GUARD,
     useClass: AuthGuard
  }],
})
export class AppModule {}
