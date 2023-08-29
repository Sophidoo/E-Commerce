import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ReviewsService } from '../service/reviews.service';
import { User } from 'src/decorator/user.decorator';
import { ReviewDTO } from '../dto/ReviewDTO';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService : ReviewsService){}

    @Post('/:productId')
    addProductReview(@Param('producId') productId : number, @User() user: number, dto: ReviewDTO){
        return this.reviewsService.addProductReview(productId, user, dto)
    }

    @Delete('/:reviewId')
    deleteReview(@Param('reviewId') reviewId : number, @User() user: number){
        return this.reviewsService.deleteAReview(reviewId, user)
    }

    @Get('/:productId')
    getAllReviewsForAProduct(@Param('productId') productId : number, @Query('pageSize') pageSize? : number,  @Query('pageNo') pageNo? : number){
        return this.reviewsService.getAllProductReviews(productId, pageSize, pageNo)
    }
}
