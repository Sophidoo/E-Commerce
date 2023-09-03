import { PrismaService } from 'src/database/prisma.service';
import { ReviewDTO } from '../dto/ReviewDTO';
import { ReviewResponseDTO } from '../dto/ReviewResponseDTO';
import { AuditService } from 'src/modules/audit/service/audit.service';
export declare class ReviewsService {
    private readonly prismaService;
    private readonly auditServce;
    constructor(prismaService: PrismaService, auditServce: AuditService);
    addProductReview(productId: number, userId: number, dto: ReviewDTO): Promise<ReviewResponseDTO>;
    getAllProductReviews(productId: number, pageSize?: number, pageNo?: number): Promise<ReviewResponseDTO[]>;
    deleteAReview(reviewId: number, userId: number): Promise<string>;
}
