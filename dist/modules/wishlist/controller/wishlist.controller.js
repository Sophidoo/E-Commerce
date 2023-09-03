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
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const wishlist_service_1 = require("../service/wishlist.service");
const user_decorator_1 = require("../../../decorator/user.decorator");
const client_1 = require("@prisma/client");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const swagger_1 = require("@nestjs/swagger");
let WishlistController = class WishlistController {
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    addToWishlist(productId, user) {
        return this.wishlistService.addToWishList(productId, user);
    }
    removeFromWishList(productId, user) {
        return this.wishlistService.removeFromWishList(productId, user);
    }
    getAlProductInWishlist(user, pageNo, pageSize, sortBy, sortDir, filterParam) {
        return this.wishlistService.viewAllInWishlist({ pageNo, pageSize, sortBy, sortDir, filterParam }, user);
    }
};
__decorate([
    (0, common_1.Get)('/add/:productId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Get)('/remove/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "removeFromWishList", null);
__decorate([
    (0, common_1.Get)('/all'),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('pageNo')),
    __param(2, (0, common_1.Query)('pageSize')),
    __param(3, (0, common_1.Query)('sortBy')),
    __param(4, (0, common_1.Query)('sortDir')),
    __param(5, (0, common_1.Query)('filterParam')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, String, String, String]),
    __metadata("design:returntype", void 0)
], WishlistController.prototype, "getAlProductInWishlist", null);
WishlistController = __decorate([
    (0, swagger_1.ApiTags)('Wishlist'),
    (0, common_1.Controller)('api/v1/wishlist'),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
exports.WishlistController = WishlistController;
//# sourceMappingURL=wishlist.controller.js.map