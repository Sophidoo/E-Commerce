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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("../service/payment.service");
const MetaData_1 = require("../dto/MetaData");
const PaymentDTO_1 = require("../dto/PaymentDTO");
const user_decorator_1 = require("../../../decorator/user.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    initiailizePayment(email, amount, metadata, coupon) {
        return this.paymentService.initializePayment(email, amount, metadata, coupon);
    }
    verifyTransaction(reference) {
        return this.paymentService.verifyTransaction(reference);
    }
    createPayment(dto, user) {
        return this.paymentService.createPayment(dto, user);
    }
    async getMonthlySales(year) {
        return this.paymentService.retrieveMonthlySales(year);
    }
};
__decorate([
    (0, common_1.Post)('/:email/:amount'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('amount')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Query)('coupon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, MetaData_1.Metadata, String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "initiailizePayment", null);
__decorate([
    (0, common_1.Get)('/verify/:reference'),
    __param(0, (0, common_1.Param)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "verifyTransaction", null);
__decorate([
    (0, common_1.Post)('/savePayment'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PaymentDTO_1.PaymentDTO, Number]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Get)('/graph/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getMonthlySales", null);
PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
exports.PaymentController = PaymentController;
//# sourceMappingURL=payment.controller.js.map