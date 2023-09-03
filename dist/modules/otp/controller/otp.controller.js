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
exports.OtpController = void 0;
const common_1 = require("@nestjs/common");
const otp_service_1 = require("../service/otp.service");
const createOtpDTO_1 = require("../dtos/createOtpDTO");
const verifyOtp_1 = require("../dtos/verifyOtp");
const public_decorator_1 = require("../../../decorator/public.decorator");
const swagger_1 = require("@nestjs/swagger");
let OtpController = class OtpController {
    constructor(otpService) {
        this.otpService = otpService;
    }
    createOtp(dto) {
        return this.otpService.createOtp(dto);
    }
    verifyOtp(dto) {
        return this.otpService.verifyOtp(dto);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createOtpDTO_1.CreateOtpDTO]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "createOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verifyOtp_1.VerifyOtpDTO]),
    __metadata("design:returntype", void 0)
], OtpController.prototype, "verifyOtp", null);
OtpController = __decorate([
    (0, swagger_1.ApiTags)('Otp'),
    (0, common_1.Controller)('otp'),
    __metadata("design:paramtypes", [otp_service_1.OtpService])
], OtpController);
exports.OtpController = OtpController;
//# sourceMappingURL=otp.controller.js.map