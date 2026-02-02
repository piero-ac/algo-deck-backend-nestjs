import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';
import { FsrsService } from 'src/fsrs/fsrs.service';
import { Card, Rating as FsrsRating } from 'ts-fsrs';
import { BadRequestException, ConflictException } from '@nestjs/common';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private fsrs: FsrsService,
  ) {}

  async getReviewsDueCount(params: { userId: number }): Promise<number> {
    const { userId } = params;
    return this.prisma.currentReview.count({
      where: {
        due: {
          lte: new Date(),
        },
        userId: userId,
      },
    });
  }

  async getReviewsDue(params: { userId: number }): Promise<ReviewsDueDto[]> {
    const { userId } = params;
    return this.prisma.currentReview.findMany({
      where: {
        due: {
          lte: new Date(),
        },
        userId: userId,
      },
      orderBy: {
        due: 'asc',
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
        due: true,
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

    const mappedRating = this.fsrs.mapNumberToFsrs(rating);

    if (mappedRating === FsrsRating.Manual) {
      throw new BadRequestException('INVALID_RATING');
    }

    const now = new Date();
    if (result && result.due > now) {
      throw new ConflictException('REVIEW_NOT_DUE');
    }

    return this.prisma.$transaction(async (tx) => {
      const reviewData = await tx.currentReview.findFirst({
        where: {
          problemNumber: problemNumber,
          userId: userId,
        },
        select: {
          problemNumber: true,
          stability: true,
          difficulty: true,
          elapsedDays: true,
          scheduledDays: true,
          reps: true,
          lapses: true,
          learningSteps: true,
          state: true,
          lastReview: true,
          due: true,
        },
      });

      let card: Card;
      if (reviewData === null) {
        card = this.fsrs.createNewCard();
      } else {
        card = this.fsrs.rowToCard(reviewData);
      }

      const reviewedCard = this.fsrs.schedule(card, rating);

      const currentReviewsCard = this.fsrs.cardToRowForCurrentReviews(
        reviewedCard.card,
        userId,
        problemNumber,
      );

      const reviewHistoryCard = this.fsrs.cardToRowForReviewHistory(
        reviewedCard.card,
        reviewedCard.log,
        userId,
        problemNumber,
      );

      await tx.currentReview.upsert({
        where: {
          userId_problemNumber: {
            userId,
            problemNumber,
          },
        },
        update: currentReviewsCard,
        create: currentReviewsCard,
      });

      await tx.reviewHistory.create({ data: reviewHistoryCard });
      return { userId, problemNumber, nextReviewAt: reviewedCard.card.due };
    });
  }
}
