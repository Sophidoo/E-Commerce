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
exports.AddressController = void 0;
const common_1 = require("@nestjs/common");
const address_service_1 = require("../service/address.service");
const addressDTO_1 = require("../dto/addressDTO");
const user_decorator_1 = require("../../../decorator/user.decorator");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let AddressController = class AddressController {
    constructor(addressService) {
        this.addressService = addressService;
    }
    addAddress(dto, user) {
        return this.addressService.addAddress(user, dto);
    }
    editAddress(dto, addressId) {
        return this.addressService.editAddress(addressId, dto);
    }
    getAllAddress(user) {
        return this.addressService.getAllUserAddresses(user);
    }
    getDefaultAddress(user) {
        return this.addressService.getDefaultAddress(user);
    }
    deleteAddress(addressId) {
        return this.addressService.deleteAddress(addressId);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Post)('/add'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addressDTO_1.AddressDTO, Number]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "addAddress", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Patch)('/edit/:addressId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [addressDTO_1.AddressDTO, Number]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "editAddress", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "getAllAddress", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)('/default'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "getDefaultAddress", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Delete)('/:addressId'),
    __param(0, (0, common_1.Param)('addressId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AddressController.prototype, "deleteAddress", null);
AddressController = __decorate([
    (0, swagger_1.ApiTags)("Address"),
    (0, common_1.Controller)('api/v1/address'),
    __metadata("design:paramtypes", [address_service_1.AddressService])
], AddressController);
exports.AddressController = AddressController;
//# sourceMappingURL=address.controller.js.map