import { ReviewsService } from '../service/reviews.service';
import { ReviewDTO } from '../dto/ReviewDTO';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    addProductReview(productId: number, user: number, dto: ReviewDTO): Promise<import("../dto/ReviewResponseDTO").ReviewResponseDTO>;
    deleteReview(reviewId: number, user: number): Promise<string>;
    getAllReviewsForAProduct(productId: number, pageSize?: number, pageNo?: number): Promise<import("../dto/ReviewResponseDTO").ReviewResponseDTO[]>;
}
