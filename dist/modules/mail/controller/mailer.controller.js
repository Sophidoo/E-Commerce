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
exports.MailerController = void 0;
const common_1 = require("@nestjs/common");
const mailer_service_1 = require("../service/mailer.service");
const public_decorator_1 = require("../../../decorator/public.decorator");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let MailerController = class MailerController {
    constructor(mailService) {
        this.mailService = mailService;
    }
    sendEmail(email, subject, data) {
        console.log(email + " controller");
        return this.mailService.sendMail(email, subject, data);
    }
    sendToAll(subject, data) {
        return this.mailService.sendMailToAll(subject, data);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('subject')),
    __param(2, (0, common_1.Query)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MailerController.prototype, "sendEmail", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Query)('subject')),
    __param(1, (0, common_1.Query)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MailerController.prototype, "sendToAll", null);
MailerController = __decorate([
    (0, swagger_1.ApiTags)('Mail'),
    (0, common_1.Controller)('mailer'),
    __metadata("design:paramtypes", [mailer_service_1.MailService])
], MailerController);
exports.MailerController = MailerController;
//# sourceMappingURL=mailer.controller.js.map