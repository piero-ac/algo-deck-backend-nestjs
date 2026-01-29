import { Controller, Get, Param } from '@nestjs/common';
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

  // @Put(':problemNumber')
}
