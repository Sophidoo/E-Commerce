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
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const CouponResponseDTO_1 = require("../dto/CouponResponseDTO");
const AuditDTO_1 = require("../../audit/dto/AuditDTO");
const audit_service_1 = require("../../audit/service/audit.service");
const class_transformer_1 = require("class-transformer");
let CouponService = class CouponService {
    constructor(prismaService, auditSercice) {
        this.prismaService = prismaService;
        this.auditSercice = auditSercice;
    }
    async createCoupon(dto, userId) {
        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                couponCode: dto.couponCode
            }
        });
        if (couponExist) {
            throw new common_1.ConflictException("Coupon with this code already exists");
        }
        const coupon = await this.prismaService.coupon.create({
            data: {
                couponCode: dto.couponCode,
                discountPercentage: dto.discountPercentage,
                expiryDate: dto.expiryDate,
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'CREATE';
        audit.createdAt = new Date();
        audit.oldData = {};
        audit.newData = Object.assign({}, coupon);
        audit.recordId = coupon.id;
        audit.tableName = "Coupon";
        audit.userId = userId;
        await this.auditSercice.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(CouponResponseDTO_1.CouponResponseDTO, coupon);
    }
    async editCoupon(couponId, dto, userId) {
        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                id: couponId
            }
        });
        if (!couponExist) {
            throw new common_1.NotFoundException("Coupon with this id does not exist");
        }
        if (dto.couponCode) {
            const couponCodeExist = await this.prismaService.coupon.findUnique({
                where: {
                    couponCode: dto.couponCode
                }
            });
            if (couponCodeExist) {
                throw new common_1.ConflictException("Coupon with this code already exists");
            }
        }
        const coupon = await this.prismaService.coupon.update({
            where: {
                id: couponId
            },
            data: {
                couponCode: dto.couponCode,
                discountPercentage: dto.discountPercentage,
                expiryDate: dto.expiryDate,
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'UPDATE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, couponExist);
        audit.newData = Object.assign({}, coupon);
        audit.recordId = coupon.id;
        audit.tableName = "Coupon";
        audit.userId = userId;
        await this.auditSercice.addToAudit(audit);
        return (0, class_transformer_1.plainToInstance)(CouponResponseDTO_1.CouponResponseDTO, coupon);
    }
    async deleteCoupon(couponId, userId) {
        const couponExist = await this.prismaService.coupon.findUnique({
            where: {
                id: couponId
            }
        });
        if (!couponExist) {
            throw new common_1.NotFoundException("Coupon with this id does not exist");
        }
        await this.prismaService.coupon.delete({
            where: {
                id: couponId
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'DELETE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, couponExist);
        audit.newData = {};
        audit.recordId = couponExist.id;
        audit.tableName = "Coupon";
        audit.userId = userId;
        await this.auditSercice.addToAudit(audit);
        return "Coupon deleted successfully";
    }
    async viewAllCoupons() {
        const coupons = await this.prismaService.coupon.findMany();
        return coupons.map(coupon => (0, class_transformer_1.plainToInstance)(CouponResponseDTO_1.CouponResponseDTO, coupon));
    }
    async findAParticularCoupon(couponCode) {
        const coupon = await this.prismaService.coupon.findUnique({
            where: {
                couponCode
            }
        });
        if (!coupon) {
            throw new common_1.NotFoundException("Coupon with this code does not exist");
        }
        return (0, class_transformer_1.plainToInstance)(CouponResponseDTO_1.CouponResponseDTO, coupon);
    }
};
CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], CouponService);
exports.CouponService = CouponService;
//# sourceMappingURL=coupon.service.js.map