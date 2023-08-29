import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { ReviewDTO } from '../dto/ReviewDTO';
import { Reviews } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ReviewResponseDTO } from '../dto/ReviewResponseDTO';
import { AuditDTO } from 'src/modules/audit/dto/AuditDTO';
import { AuditService } from 'src/modules/audit/service/audit.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly prismaService : PrismaService, private readonly auditServce : AuditService){}

    async addProductReview(productId : number, userId : number, dto: ReviewDTO) : Promise<ReviewResponseDTO>{
        const product = await this.prismaService.product.findUnique({
            where: {
                id: productId
            }
        })

        if(!product){
            throw new NotFoundException('Product not found')
        }

        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            throw new NotFoundException('User not found')
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
        })

        return plainToInstance(ReviewResponseDTO, review)
    }

    async getAllProductReviews(productId: number, pageSize? : number, pageNo? : number) : Promise<ReviewResponseDTO[]> {
        const page = pageNo || 1
        const size = pageSize || 20
        const reviews = await this.prismaService.reviews.findMany({
            where: {
                productId : productId
            },
            take: size,
            skip: (page - 1) * size,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: true
            }
        })
        return reviews.map(review => plainToInstance(ReviewResponseDTO, review))
    }

    async deleteAReview(reviewId : number, userId : number) : Promise<string>{
        const review = await this.prismaService.reviews.findUnique({
            where: {
                id : reviewId
            }
        })

        if(!review){
            throw new NotFoundException("Review does not exist")
        }

        await this.prismaService.reviews.delete({
            where: {
                id: reviewId
            }
        })

        const audit = new AuditDTO
        audit.action = 'DELETE'
        audit.createdAt = new Date()
        audit.oldData = {
            ...review
        }
        audit.newData = {}
        audit.recordId = review.id
        audit.tableName = "Reviews"
        audit.userId = userId
        await this.auditServce.addToAudit(audit)

        return "Review deleted Successfully"
    }
}
