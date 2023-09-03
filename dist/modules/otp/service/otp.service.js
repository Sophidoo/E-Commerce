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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const speakeasy = require("speakeasy");
let OtpService = class OtpService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createOtp(dto) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) {
            throw new common_1.NotFoundException("User with this email does not exist");
        }
        const otp = await this.prismaService.otp.findFirst({
            where: {
                otpType: dto.otpType,
                userEmail: dto.email
            }
        });
        if (otp)
            await this.clearOtp(dto.email, dto.otpType);
        const currentDate = new Date();
        const token = speakeasy.totp({
            secret: dto.email,
            encoding: 'base32'
        });
        const otpToken = await this.prismaService.otp.create({
            data: {
                token: token,
                userEmail: dto.email,
                expiryDate: new Date(currentDate.getTime() + (10 * 60 * 1000)),
                otpType: dto.otpType
            }
        });
        return otpToken.token;
    }
    async verifyOtp(dto) {
        const otp = await this.prismaService.otp.findFirst({
            where: {
                token: dto.token,
                otpType: dto.otpType,
                userEmail: dto.email
            }
        });
        if (!otp) {
            throw new common_1.NotFoundException("Incorrect Otp");
        }
        const today = new Date();
        const elapsedTime = otp.expiryDate.getTime() - otp.createdAt.getTime();
        if (elapsedTime > today.getTime()) {
            throw new common_1.UnauthorizedException("Otp Expired");
        }
        await this.clearOtp(dto.email, dto.otpType);
        return true;
    }
    async clearOtp(email, otpType) {
        await this.prismaService.otp.deleteMany({
            where: {
                otpType,
                userEmail: email
            }
        });
    }
};
OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OtpService);
exports.OtpService = OtpService;
//# sourceMappingURL=otp.service.js.map