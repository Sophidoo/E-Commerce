"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth/controller/auth.controller");
const auth_service_1 = require("./auth/service/auth.service");
const prisma_module_1 = require("../../database/prisma.module");
const otp_module_1 = require("../otp/otp.module");
const mail_module_1 = require("../mail/mail.module");
const google_strategy_service_1 = require("./auth/service/google-strategy.service");
const google_strategy_controller_1 = require("./auth/controller/google-strategy.controller");
const cloudinary_service_1 = require("../../config/cloudinary.service");
const platform_express_1 = require("@nestjs/platform-express");
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, common_1.Module)({
        controllers: [auth_controller_1.AuthController, google_strategy_controller_1.GoogleStrategyController],
        providers: [auth_service_1.AuthService, google_strategy_service_1.GoogleStrategyService, cloudinary_service_1.CloudinaryService],
        imports: [prisma_module_1.PrismaModule, otp_module_1.OtpModule, mail_module_1.MailModule, platform_express_1.MulterModule.register({
                dest: "/profile"
            })]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map