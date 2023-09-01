import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RoleType } from '@prisma/client';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaService } from 'src/database/prisma.service';
import { AuthService } from './auth.service';


@Injectable()
export class GoogleStrategyService extends PassportStrategy(Strategy, 'google'){

    

    constructor(private readonly prismaService: PrismaService, private readonly authService : AuthService){
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['email', 'profile']
        })
    }

    async validate (accessToken : string, refreshToken : string, profile: any, done: VerifyCallback) : Promise<any>{
        console.log(profile)
        const {name, emails, photos} = profile
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }

        let userProfile = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            }
        })

        if(userProfile && userProfile.isBlocked){
            throw new UnauthorizedException('Account is blocked, Please contact support')
        }

        if(!userProfile){
            userProfile = await this.prismaService.user.create({
                data:{
                    firstname: `${user.firstName}`,
                    lastname: `${user.lastName}`,
                    email: `${user.email}`,
                    password: '',
                    username: '',
                    isVerified: true,
                    isBlocked: false,
                    role: RoleType.USER,
                    cart: {
                        create: {
                            quantity: 0,
                            cartTotal : 0
                        }
                    },
                    wishlist: {
                        create: {}
                    }
                }
            })
        }

        const token = this.authService.signJwt(userProfile.id) 
        const role = userProfile.role
        done(null, {token, role})

    }

    async googleLogin(req : any){
        if(!req.user){
            return 'No user from google'
        }

        return {
            message: 'Successfull',
            user: req.user
          }
    }
}
