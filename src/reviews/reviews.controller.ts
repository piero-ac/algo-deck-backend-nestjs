import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewStatsService } from './review-stats.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';
import { UserProgressDto } from 'src/dto/user-progress.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/generated/prisma/client';
import { type RequestWithUser } from 'src/auth/auth.guard';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly reviewStatsService: ReviewStatsService,
  ) {}

  @Get('progress')
  async getUserProgress(
    @Request() request: RequestWithUser,
  ): Promise<UserProgressDto> {
    const authenticatedUser = request.user as User;
    return this.reviewStatsService.getUserProgress(authenticatedUser.id);
  }

  @Get('due')
  async getDueReviews(
    @Request() request: RequestWithUser,
  ): Promise<ReviewsDueDto[]> {
    const authenticatedUser = request.user as User;
    return this.reviewsService.getReviewsDue(authenticatedUser.id);
  }

  @Get('count')
  async getReviewCount(@Request() request: RequestWithUser): Promise<number> {
    const authenticatedUser = request.user as User;
    return this.reviewsService.getReviewsDueCount(authenticatedUser.id);
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
