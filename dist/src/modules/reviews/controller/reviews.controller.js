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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("../service/reviews.service");
const user_decorator_1 = require("../../../decorator/user.decorator");
const ReviewDTO_1 = require("../dto/ReviewDTO");
const roles_decorator_1 = require("../../../decorator/roles.decorator");
const client_1 = require("@prisma/client");
const swagger_1 = require("@nestjs/swagger");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    addProductReview(productId, user, dto) {
        return this.reviewsService.addProductReview(productId, user, dto);
    }
    deleteReview(reviewId, user) {
        return this.reviewsService.deleteAReview(reviewId, user);
    }
    getAllReviewsForAProduct(productId, pageSize, pageNo) {
        return this.reviewsService.getAllProductReviews(productId, pageSize, pageNo);
    }
};
__decorate([
    (0, common_1.Post)('/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, user_decorator_1.User)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, ReviewDTO_1.ReviewDTO]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "addProductReview", null);
__decorate([
    (0, roles_decorator_1.Roles)(client_1.RoleType.ADMIN),
    (0, common_1.Delete)('/:reviewId'),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('/:productId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Query)('pageSize')),
    __param(2, (0, common_1.Query)('pageNo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ReviewsController.prototype, "getAllReviewsForAProduct", null);
ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('Reviews'),
    (0, common_1.Controller)('api/v1/reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
exports.ReviewsController = ReviewsController;
//# sourceMappingURL=reviews.controller.js.map