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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("../service/product.service");
const ProductDTO_1 = require("../dto/ProductDTO");
const EditProductDTO_1 = require("../dto/EditProductDTO");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const public_decorator_1 = require("../../../decorator/public.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const ProductImageUploadDTO_1 = require("../dto/ProductImageUploadDTO");
const CategoryDTO_1 = require("../dto/CategoryDTO");
const user_decorator_1 = require("../../../decorator/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    addProduct(dto, user) {
        return this.productService.addProduct(dto, user);
    }
    editProduct(dto, id, user) {
        return this.productService.editProduct(id, dto, user);
    }
    deleteProduct(id, user) {
        return this.productService.deleteProduct(id, user);
    }
    getProductById(id) {
        return this.productService.getProductById(id);
    }
    getAllProducts(pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue) {
        return this.productService.getAllProduct({ pageNo, pageSize, sortBy, sortDir, filterBy, filterParam, filterKey, filterValue });
    }
    getAll() {
        return this.productService.getAllProductWithoutPagination();
    }
    uploadImage(file, id, dto, user) {
        return this.productService.addproductImages(file, id, dto, user);
    }
    editProductImage(file, id, dto, user) {
        return this.productService.editProductImages(file, id, dto, user);
    }
    deleteIMage(id, user) {
        return this.productService.deleteProductImage(id, user);
    }
    addCategory(dto, user) {
        return this.productService.addCategory(dto, user);
    }
    editCategory(dto, categoryId, user) {
        return this.productService.editCategory(dto, categoryId, user);
    }
    findByCategoryName(categoryName) {
        return this.productService.findByCategoryName(categoryName);
    }
    getAllCategories() {
        return this.productService.getAllCategories();
    }
    deleteEmptyCategory(categoryId, user) {
        return this.productService.deleteCategory(categoryId, user);
    }
};
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProductDTO_1.ProductDTO, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addProduct", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Patch)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditProductDTO_1.EditProductDTO, Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "editProduct", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/product/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Query)('pageNo')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortDir')),
    __param(4, (0, common_1.Query)('filterBy')),
    __param(5, (0, common_1.Query)('filterParam')),
    __param(6, (0, common_1.Query)('filterKey')),
    __param(7, (0, common_1.Query)('filterValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)('/upload/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, ProductImageUploadDTO_1.ProductImageUploadDTO, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Put)('/editImage/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: /(jpg|jpeg|png|gif)$/
    })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY
    }))),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, ProductImageUploadDTO_1.ProductImageUploadDTO, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "editProductImage", null);
__decorate([
    (0, common_1.Delete)('/deleteImage/:id'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteIMage", null);
__decorate([
    (0, common_1.Post)('/category'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryDTO_1.CategoryDTO, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Put)('/category/:categoryId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('categoryId')),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CategoryDTO_1.CategoryDTO, Number, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "editCategory", null);
__decorate([
    (0, common_1.Get)('/category/:categoryName'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('categoryName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "findByCategoryName", null);
__decorate([
    (0, common_1.Get)('/category'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "getAllCategories", null);
__decorate([
    (0, common_1.Delete)('/category/:categoryId'),
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ProductController.prototype, "deleteEmptyCategory", null);
ProductController = __decorate([
    (0, swagger_1.ApiTags)('Product'),
    (0, common_1.Controller)('api/v1/product'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map