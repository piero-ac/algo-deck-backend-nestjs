import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewStatsService } from './review-stats.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';
import { UserProgressDto } from 'src/dto/user-progress.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reviewStatsService: ReviewStatsService,
  ) {}

  @Get('progress/:userId')
  async getUserProgress(
    @Param('userId') userId: string,
  ): Promise<UserProgressDto> {
    return this.reviewStatsService.getUserProgress(Number(userId));
  }

  @Get('due/:userId')
  async getDueReviews(
    @Param('userId') userId: string,
  ): Promise<ReviewsDueDto[]> {
    return this.reviewsService.getReviewsDue({ userId: Number(userId) });
  }

  @Get('count/:userId')
  async getReviewCount(@Param('userId') userId: string): Promise<number> {
    return this.reviewsService.getReviewsDueCount({ userId: Number(userId) });
  }

  @Put('submit-review')
  async submitReview(
    @Body()
    reviewData: {
      userId: string;
      problemNumber: string;
      rating: string;
    },
  ) {
    const { userId, problemNumber, rating } = reviewData;

    const cardData = this.reviewsService.submitReview({
      userId: Number(userId),
      problemNumber: Number(problemNumber),
      rating: Number(rating),
    });

    return cardData;
  }
}
