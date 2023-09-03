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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("../service/cart.service");
const user_decorator_1 = require("../../../decorator/user.decorator");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    addToCart(productId, user) {
        return this.cartService.addToCart(productId, user);
    }
    increaseCartItemQuantity(cartItemId) {
        return this.cartService.increaseCartItemQuantity(cartItemId);
    }
    decreaseCartItemQuantity(cartItemId) {
        return this.cartService.decreaseCartItemQuantity(cartItemId);
    }
    getAllCartItems(user) {
        return this.cartService.getAllCartItems(user);
    }
    deleteCartItem(cartItemId) {
        return this.cartService.deleteCartItem(cartItemId);
    }
    clearCart(user) {
        return this.cartService.clearCart(user);
    }
};
__decorate([
    (0, common_1.Post)('/:productId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Get)('/increase/:cartItemId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, common_1.Param)('cartItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "increaseCartItemQuantity", null);
__decorate([
    (0, common_1.Get)('/decrease/:cartItemId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, common_1.Param)('cartItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "decreaseCartItemQuantity", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getAllCartItems", null);
__decorate([
    (0, common_1.Delete)('/delete/:cartItemId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, common_1.Param)('cartItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "deleteCartItem", null);
__decorate([
    (0, common_1.Delete)('/clearCart'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('api/v1/cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
exports.CartController = CartController;
//# sourceMappingURL=cart.controller.js.map