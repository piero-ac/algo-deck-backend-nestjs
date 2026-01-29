import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReviewsDueDto } from 'src/dto/reviews-due.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getReviewsDue(): Promise<ReviewsDueDto[]> {
    return this.prisma.currentReview.findMany({
      where: {
        nextReviewAt: {
          lte: new Date(),
        },
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

  // async getReviewDueDate(params: { problemNumber: number }) {
  //   const { problemNumber } = params;

  //   return this.prisma.currentReview({})
  // }
}
