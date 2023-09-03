import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { RoleType } from '@prisma/client';

@Injectable()
export class AppService implements OnApplicationBootstrap{
  constructor(private readonly prismaService: PrismaService){}
  async onApplicationBootstrap() {

    if((await this.prismaService.user.findMany()).length == 0){
      await this.prismaService.user.create({
          data: {
              username: 'admin',
              email: 'ecommerce@gmail.com',
              password: await this.hashPassword('root@Password'),
              isBlocked: false,
              cart: {
                  create: {
                      quantity: 0,
                      cartTotal : 0
                  }
              },
              wishlist: {
                  create: {}
              },
              role: RoleType.ADMIN,
              isVerified: true,
          }
      })
    }
  }
  
  public async hashPassword (password: string) {
      const salt = await bcrypt.genSalt(10)
      return await bcrypt.hash(password, salt)
  }
  
}
