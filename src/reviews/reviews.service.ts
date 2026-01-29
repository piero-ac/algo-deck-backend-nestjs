import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';

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
}
