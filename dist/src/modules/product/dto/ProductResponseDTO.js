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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductResponseDTO = exports.DecimalNumber = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const class_transformer_1 = require("class-transformer");
class DecimalNumber extends library_1.Decimal {
    constructor(value = 0) { super(value); }
}
exports.DecimalNumber = DecimalNumber;
let ProductResponseDTO = class ProductResponseDTO {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProductResponseDTO.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductResponseDTO.prototype, "productName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => DecimalNumber),
    __metadata("design:type", DecimalNumber)
], ProductResponseDTO.prototype, "productPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProductResponseDTO.prototype, "quantityAvailable", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductResponseDTO.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Array)
], ProductResponseDTO.prototype, "images", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductResponseDTO.prototype, "categoryName", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductResponseDTO.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductResponseDTO.prototype, "brand", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ProductResponseDTO.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ProductResponseDTO.prototype, "updatedAt", void 0);
ProductResponseDTO = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ProductResponseDTO);
exports.ProductResponseDTO = ProductResponseDTO;
//# sourceMappingURL=ProductResponseDTO.js.map