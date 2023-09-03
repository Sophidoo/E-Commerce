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
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const noification_service_1 = require("../service/noification.service");
const user_decorator_1 = require("../../../decorator/user.decorator");
const notificationDTO_1 = require("../dto/notificationDTO");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    sendNotification(user, dto) {
        return this.notificationService.sendNotificationToUser(user, dto);
    }
    sendNotificationToAll(dto) {
        return this.notificationService.sendNotificationTOAll(dto);
    }
    getUSerNotification(user, pageSize, pageNo) {
        return this.notificationService.getAllUserNotification(user, pageSize, pageNo);
    }
    getAllNotifications(pageSize, pageNo) {
        return this.notificationService.getAllNotifications(pageSize, pageNo);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, notificationDTO_1.NotificationDTO]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('/all'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notificationDTO_1.NotificationDTO]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "sendNotificationToAll", null);
__decorate([
    (0, common_1.Get)('/user'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.USER, client_1.RoleType.ADMIN),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "getUSerNotification", null);
__decorate([
    (0, common_1.Get)('/all'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Query)('pageSize')),
    __param(1, (0, common_1.Query)('pageNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], NotificationController.prototype, "getAllNotifications", null);
NotificationController = __decorate([
    (0, swagger_1.ApiTags)('Notification'),
    (0, common_1.Controller)('api/v1/notification'),
    __metadata("design:paramtypes", [noification_service_1.NoificationService])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map