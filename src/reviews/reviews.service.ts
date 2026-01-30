import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';
import { Rating } from 'src/generated/prisma/enums';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getReviewsDue(params: { userId: number }): Promise<ReviewsDueDto[]> {
    const { userId } = params;
    return this.prisma.currentReview.findMany({
      where: {
        nextReviewAt: {
          lte: new Date(),
        },
        userId: userId,
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
      select: {
        userId: true,
        problemNumber: true,
        problem: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async getReviewDueDate(params: { userId: number; problemNumber: number }) {
    const { userId, problemNumber } = params;

    return this.prisma.currentReview.findFirst({
      where: {
        problemNumber: problemNumber,
        userId: userId,
      },
      select: {
        nextReviewAt: true,
      },
    });
  }

  async submitReview(params: {
    userId: number;
    problemNumber: number;
    rating: number;
  }) {
    const { userId, problemNumber, rating } = params;
    const result = await this.getReviewDueDate({ userId, problemNumber });

    if (!result) {
      throw new Error('NO_REVIEW_HISTORY');
    }

    const now = new Date();
    if (result.nextReviewAt > now) {
      throw new Error('REVIEW_NOT_DUE');
    }

    /**
     * Start transcation for submission
     * 1. Fetch the row from current_reviews
     * 2. Create a card from Row (if exists) (fsrs.rowToCard) or new Card with (fsrs.createNewCard) now
     * 3. Run FSRS
     * 4. Map rating number to Rating enum (check for invalid rating)
     * 5. Upsert the card - current_reviews (cardToRowForCurrentReviews)
     * 6. Upload review log - review_history (cardToRowForReviewHistory)
     * 6. Return { nextReviewAt }
     */
  }
}
