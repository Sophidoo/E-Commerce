"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const common_1 = require("@nestjs/common");
const order_controller_1 = require("./controller/order.controller");
const order_service_1 = require("./service/order.service");
const prisma_module_1 = require("../../database/prisma.module");
const audit_service_1 = require("../audit/service/audit.service");
const address_service_1 = require("../address/service/address.service");
const payment_service_1 = require("./service/payment.service");
const payment_controller_1 = require("./controller/payment.controller");
const cart_service_1 = require("../cart/service/cart.service");
const coupon_service_1 = require("../coupon/service/coupon.service");
const noification_service_1 = require("../notification/service/noification.service");
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    (0, common_1.Module)({
        controllers: [order_controller_1.OrderController, payment_controller_1.PaymentController],
        providers: [order_service_1.OrderService, audit_service_1.AuditService, address_service_1.AddressService, cart_service_1.CartService, noification_service_1.NoificationService, payment_service_1.PaymentService, coupon_service_1.CouponService],
        imports: [prisma_module_1.PrismaModule]
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map