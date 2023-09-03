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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponController = void 0;
const common_1 = require("@nestjs/common");
const coupon_service_1 = require("../service/coupon.service");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const CouponDTO_1 = require("../dto/CouponDTO");
const user_decorator_1 = require("../../../decorator/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let CouponController = class CouponController {
    constructor(couponService) {
        this.couponService = couponService;
    }
    createCoupon(dto, user) {
        return this.couponService.createCoupon(dto, user);
    }
    editCOupon(couponId, dto, user) {
        return this.couponService.editCoupon(couponId, dto, user);
    }
    findByCouponCode(couponCode) {
        return this.couponService.findAParticularCoupon(couponCode);
    }
    viewAllCoupons() {
        return this.couponService.viewAllCoupons();
    }
    deleteCoupon(couponId, user) {
        return this.couponService.deleteCoupon(couponId, user);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CouponDTO_1.CouponDTO, Number]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "createCoupon", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Patch)('/:couponId'),
    __param(0, (0, common_1.Param)('couponId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CouponDTO_1.EditCouponDTO, Number]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "editCOupon", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)('/findOne/:couponCode'),
    __param(0, (0, common_1.Param)('couponCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "findByCouponCode", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "viewAllCoupons", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Delete)('/:couponId'),
    __param(0, (0, common_1.Param)('couponId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CouponController.prototype, "deleteCoupon", null);
CouponController = __decorate([
    (0, swagger_1.ApiTags)('Coupon'),
    (0, common_1.Controller)('api/v1/coupon'),
    __metadata("design:paramtypes", [coupon_service_1.CouponService])
], CouponController);
exports.CouponController = CouponController;
//# sourceMappingURL=coupon.controller.js.map