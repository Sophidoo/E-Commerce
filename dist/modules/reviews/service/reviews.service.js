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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../database/prisma.service");
const class_transformer_1 = require("class-transformer");
const ReviewResponseDTO_1 = require("../dto/ReviewResponseDTO");
const AuditDTO_1 = require("../../audit/dto/AuditDTO");
const audit_service_1 = require("../../audit/service/audit.service");
let ReviewsService = class ReviewsService {
    constructor(prismaService, auditServce) {
        this.prismaService = prismaService;
        this.auditServce = auditServce;
    }
    async addProductReview(productId, userId, dto) {
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const review = await this.prismaService.reviews.create({
            data: {
                feedback: dto.feedback,
                rating: dto.rating,
                productId: productId,
                userId: userId
            },
            select: {
                id: true,
                user: {
                    select: {
                        username: true
                    }
                },
                feedback: true,
                rating: true,
            }
        });
        return (0, class_transformer_1.plainToInstance)(ReviewResponseDTO_1.ReviewResponseDTO, review);
    }
    async getAllProductReviews(productId, pageSize, pageNo) {
        const page = pageNo || 1;
        const size = pageSize || 20;
        const reviews = await this.prismaService.reviews.findMany({
            where: {
                productId: productId
            },
            take: size,
            skip: (page - 1) * size,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                user: {
                    select: {
                        username: true
                    }
                },
                feedback: true,
                rating: true,
            }
        });
        return reviews.map(review => (0, class_transformer_1.plainToInstance)(ReviewResponseDTO_1.ReviewResponseDTO, review));
    }
    async deleteAReview(reviewId, userId) {
        const review = await this.prismaService.reviews.findUnique({
            where: {
                id: reviewId
            }
        });
        if (!review) {
            throw new common_1.NotFoundException("Review does not exist");
        }
        await this.prismaService.reviews.delete({
            where: {
                id: reviewId
            }
        });
        const audit = new AuditDTO_1.AuditDTO;
        audit.action = 'DELETE';
        audit.createdAt = new Date();
        audit.oldData = Object.assign({}, review);
        audit.newData = {};
        audit.recordId = review.id;
        audit.tableName = "Reviews";
        audit.userId = userId;
        await this.auditServce.addToAudit(audit);
        return "Review deleted Successfully";
    }
};
ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], ReviewsService);
exports.ReviewsService = ReviewsService;
//# sourceMappingURL=reviews.service.js.map