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
exports.ProductImageResponseDTO = void 0;
const class_transformer_1 = require("class-transformer");
const ProductResponseDTO_1 = require("./ProductResponseDTO");
let ProductImageResponseDTO = class ProductImageResponseDTO {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ProductImageResponseDTO.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ProductImageResponseDTO.prototype, "imageUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Boolean)
], ProductImageResponseDTO.prototype, "defaultImage", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", ProductResponseDTO_1.ProductResponseDTO)
], ProductImageResponseDTO.prototype, "product", void 0);
ProductImageResponseDTO = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ProductImageResponseDTO);
exports.ProductImageResponseDTO = ProductImageResponseDTO;
//# sourceMappingURL=ProductImageResponseDTO.js.map