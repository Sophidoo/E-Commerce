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
exports.OrderController = void 0;
const common_1 = require("@nestjs/common");
const order_service_1 = require("../service/order.service");
const user_decorator_1 = require("../../../decorator/user.decorator");
const CheckoutDTO_1 = require("../dto/CheckoutDTO");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const OrderStatusDTO_1 = require("../dto/OrderStatusDTO");
const swagger_1 = require("@nestjs/swagger");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    async checkout(user, dto) {
        return this.orderService.checkout(user, dto);
    }
    async viewAOrder(orderId) {
        return this.orderService.viewAParticularOrder(orderId);
    }
    async viewAllorders(pageSize, pageNo) {
        return this.orderService.viewAllOrders(pageSize, pageNo);
    }
    async viewAParticularUserOrderHistory(user, pageSize, pageNo) {
        return this.orderService.viewUserOrderHistory(user, pageSize, pageNo);
    }
    async updateOrderStatus(orderId, dto) {
        return this.orderService.updateOrderStatus(orderId, dto);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CheckoutDTO_1.CheckoutDTO]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "checkout", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)('/findOne/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "viewAOrder", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Get)('/all'),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "viewAllorders", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)('/userOrders'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "viewAParticularUserOrderHistory", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Patch)('/:orderId'),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, OrderStatusDTO_1.OrderStatusDTO]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "updateOrderStatus", null);
OrderController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('api/v1/order'),
    __metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map