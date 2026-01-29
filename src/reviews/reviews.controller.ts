import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('due/:userId')
  async getDueReviews(
    @Param('userId') userId: string,
  ): Promise<ReviewsDueDto[]> {
    return this.reviewsService.getReviewsDue({ userId: Number(userId) });
  }

  // @Put('submit-review')
  // async submitReview(
  //   @Body() reviewData: { userId: string; problemNumber: string; rating: string},
  // ) {

  //   const {userId, problemNumber, rating} = reviewData;

  // }
}
