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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const prisma_service_1 = require("../../../database/prisma.service");
const UserResponseDTO_1 = require("../../user/dtos/UserResponseDTO");
let AdminService = class AdminService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAllUsers() {
        const users = await this.prismaService.user.findMany();
        return users.map(user => (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, user));
    }
    async blockUser(userId) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const update = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: true
            }
        });
        return (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, update);
    }
    async unBlockUser(userId) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const update = await this.prismaService.user.update({
            where: {
                id: userId
            },
            data: {
                isBlocked: false
            }
        });
        return (0, class_transformer_1.plainToInstance)(UserResponseDTO_1.UserResponseDTO, update);
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map