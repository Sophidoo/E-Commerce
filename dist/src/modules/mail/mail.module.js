"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mailer_service_1 = require("./service/mailer.service");
const mailer_controller_1 = require("./controller/mailer.controller");
const prisma_module_1 = require("../../database/prisma.module");
let MailModule = class MailModule {
};
MailModule = __decorate([
    (0, common_1.Module)({
        providers: [mailer_service_1.MailService, config_1.ConfigService],
        controllers: [mailer_controller_1.MailerController],
        exports: [mailer_service_1.MailService],
        imports: [prisma_module_1.PrismaModule]
    })
], MailModule);
exports.MailModule = MailModule;
//# sourceMappingURL=mail.module.js.map