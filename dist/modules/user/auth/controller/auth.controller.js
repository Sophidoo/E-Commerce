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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../service/auth.service");
const RegisterDTO_1 = require("../../dtos/RegisterDTO");
const LoginDTO_1 = require("../../dtos/LoginDTO");
const EditAuthDetailsDTO_1 = require("../../dtos/EditAuthDetailsDTO");
const user_decorator_1 = require("../../../../decorator/user.decorator");
const public_decorator_1 = require("../../../../decorator/public.decorator");
const roles_decorator_1 = require("../../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const UpdateUserDTO_1 = require("../../dtos/UpdateUserDTO");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    signup(dto) {
        return this.authService.signup(dto);
    }
    signin(dto) {
        return this.authService.login(dto);
    }
    update(dto, user) {
        return this.authService.editUsernameOrEmail(user, dto);
    }
    updatePassword(dto, user) {
        return this.authService.updatePassword(user, dto);
    }
    updateDetails(dto, user) {
        return this.authService.editUserDetails(dto, user);
    }
    resetPassword(dto, email) {
        return this.authService.resetPassword(email, dto);
    }
    sendResetPasswordOtp(email) {
        return this.authService.sendResetOtp(email);
    }
    veriftResetPasswordOtp(email, token) {
        return this.authService.verifyResetOtp(token, email);
    }
    deleteAccount(user) {
        return this.authService.deleteMyAccount(user);
    }
    getLoggedInUser(user) {
        return this.authService.getLoggedInUser(user);
    }
    verifyEmail(email, token) {
        return this.authService.verifyEmail(token, email);
    }
    resendVerificationMail(email) {
        return this.authService.resendEmailOtp(email);
    }
    uploadProfile(file, user) {
        return this.authService.uploadProfile(file, user);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDTO_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDTO_1.LoginDTO]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signin", null);
__decorate([
    (0, common_1.Patch)('/update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAuthDetailsDTO_1.EditAuthDetailsDTO, Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('/updatePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAuthDetailsDTO_1.EditPasswordDTO, Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Patch)('/updateDetails'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserDTO_1.UpdateUserDTO, Number]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateDetails", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Patch)('/resetPassword/:email'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAuthDetailsDTO_1.ResetPasswordDTO, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/forgotPassword/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendResetPasswordOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/resetPassword/:email/:token'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "veriftResetPasswordOtp", null);
__decorate([
    (0, common_1.Put)('/deactivate'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getLoggedInUser", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/verify/:email/:token'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/verificationMail/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "resendVerificationMail", null);
__decorate([
    (0, common_1.Put)('/upload'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN, client_1.RoleType.USER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "uploadProfile", null);
AuthController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map