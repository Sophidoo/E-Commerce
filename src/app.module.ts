import { Module, ClassSerializerInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { RolesGuard } from './guards/roles.guard';
import { PrismaService } from './database/prisma.service';
import { ConfigModule } from '@nestjs/config/dist';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [UserModule, ProductModule, ConfigModule.forRoot({
    isGlobal: true
  }), MailerModule.forRoot({
    transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/src/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, {
     provide: APP_GUARD,
     useClass: AuthGuard
  },{
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule {}
