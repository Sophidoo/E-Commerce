"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const user_module_1 = require("./modules/user/user.module");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./guards/auth.guard");
const mailer_1 = require("@nestjs-modules/mailer");
const roles_guard_1 = require("./guards/roles.guard");
const prisma_service_1 = require("./database/prisma.service");
const dist_1 = require("@nestjs/config/dist");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const product_module_1 = require("./modules/product/product.module");
const cart_module_1 = require("./modules/cart/cart.module");
const address_module_1 = require("./modules/address/address.module");
const wishlist_module_1 = require("./modules/wishlist/wishlist.module");
const audit_module_1 = require("./modules/audit/audit.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const coupon_module_1 = require("./modules/coupon/coupon.module");
const order_module_1 = require("./modules/order/order.module");
const notification_module_1 = require("./modules/notification/notification.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, product_module_1.ProductModule, cart_module_1.CartModule, admin_module_1.AdminModule, address_module_1.AddressModule, wishlist_module_1.WishlistModule, reviews_module_1.ReviewsModule, notification_module_1.NotificationModule, coupon_module_1.CouponModule, audit_module_1.AuditModule, order_module_1.OrderModule, dist_1.ConfigModule.forRoot({
                isGlobal: true
            }), mailer_1.MailerModule.forRoot({
                transport: 'smtps://user@domain.com:pass@smtp.domain.com',
                template: {
                    dir: process.cwd() + '/src/template/',
                    adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            })
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, prisma_service_1.PrismaService, {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard
            }, {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard
            }],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map