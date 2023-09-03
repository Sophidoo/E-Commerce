"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategyService = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const client_1 = require("@prisma/client");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const prisma_service_1 = require("../../../../database/prisma.service");
const auth_service_1 = require("./auth.service");
let GoogleStrategyService = class GoogleStrategyService extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    constructor(prismaService, authService) {
        super({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['email', 'profile']
        });
        this.prismaService = prismaService;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        console.log(profile);
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        };
        let userProfile = await this.prismaService.user.findUnique({
            where: {
                email: user.email
            }
        });
        if (userProfile && userProfile.isBlocked) {
            throw new common_1.UnauthorizedException('Account is blocked, Please contact support');
        }
        if (!userProfile) {
            userProfile = await this.prismaService.user.create({
                data: {
                    firstname: `${user.firstName}`,
                    lastname: `${user.lastName}`,
                    email: `${user.email}`,
                    password: '',
                    username: '',
                    isVerified: true,
                    isBlocked: false,
                    role: client_1.RoleType.USER,
                    cart: {
                        create: {
                            quantity: 0,
                            cartTotal: 0
                        }
                    },
                    wishlist: {
                        create: {}
                    }
                }
            });
        }
        const token = this.authService.signJwt(userProfile.id);
        const role = userProfile.role;
        done(null, { token, role });
    }
    async googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        return {
            message: 'Successfull',
            user: req.user
        };
    }
};
GoogleStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, auth_service_1.AuthService])
], GoogleStrategyService);
exports.GoogleStrategyService = GoogleStrategyService;
//# sourceMappingURL=google-strategy.service.js.map