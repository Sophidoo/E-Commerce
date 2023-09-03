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
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./database/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
let AppService = class AppService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async onApplicationBootstrap() {
        const users = await this.prismaService.user.findMany();
        if (users && users.length == 0) {
            await this.prismaService.user.create({
                data: {
                    username: 'admin',
                    email: 'ecommerce@gmail.com',
                    password: await this.hashPassword('root@Password'),
                    isBlocked: false,
                    cart: {
                        create: {
                            quantity: 0,
                            cartTotal: 0
                        }
                    },
                    wishlist: {
                        create: {}
                    },
                    role: client_1.RoleType.ADMIN,
                    isVerified: true,
                }
            });
        }
        else {
            setTimeout(async () => {
                if (users.length == 0) {
                    await this.prismaService.user.create({
                        data: {
                            username: 'admin',
                            email: 'ecommerce@gmail.com',
                            password: await this.hashPassword('root@Password'),
                            isBlocked: false,
                            cart: {
                                create: {
                                    quantity: 0,
                                    cartTotal: 0
                                }
                            },
                            wishlist: {
                                create: {}
                            },
                            role: client_1.RoleType.ADMIN,
                            isVerified: true,
                        }
                    });
                }
            }, 10000);
        }
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map