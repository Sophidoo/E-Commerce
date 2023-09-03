"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./service/product.service");
const product_controller_1 = require("./controller/product.controller");
const prisma_module_1 = require("../../database/prisma.module");
const cloudinary_service_1 = require("../../config/cloudinary.service");
const platform_express_1 = require("@nestjs/platform-express");
const audit_module_1 = require("../audit/audit.module");
const audit_service_1 = require("../audit/service/audit.service");
let ProductModule = class ProductModule {
};
ProductModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_controller_1.ProductController],
        providers: [product_service_1.ProductService, cloudinary_service_1.CloudinaryService, audit_service_1.AuditService],
        imports: [prisma_module_1.PrismaModule, audit_module_1.AuditModule,
            platform_express_1.MulterModule.register({
                dest: './uploads',
            })]
    })
], ProductModule);
exports.ProductModule = ProductModule;
//# sourceMappingURL=product.module.js.map