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
exports.ReviewResponseDTO = exports.DecimalNumber = void 0;
const library_1 = require("@prisma/client/runtime/library");
const class_transformer_1 = require("class-transformer");
class DecimalNumber extends library_1.Decimal {
    constructor(value = 0) { super(value); }
}
exports.DecimalNumber = DecimalNumber;
let ReviewResponseDTO = class ReviewResponseDTO {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Number)
], ReviewResponseDTO.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_transformer_1.Type)(() => DecimalNumber),
    __metadata("design:type", Number)
], ReviewResponseDTO.prototype, "rating", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], ReviewResponseDTO.prototype, "feedback", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ReviewResponseDTO.prototype, "user", void 0);
ReviewResponseDTO = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ReviewResponseDTO);
exports.ReviewResponseDTO = ReviewResponseDTO;
//# sourceMappingURL=ReviewResponseDTO.js.map