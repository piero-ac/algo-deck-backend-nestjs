import { Controller, Get } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('due')
  async getDueReviews(): Promise<ReviewsDueDto[]> {
    return this.reviewsService.getReviewsDue();
  }
}
