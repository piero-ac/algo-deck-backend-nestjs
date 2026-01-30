import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReviewStatsService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: number) {
    const [totalProblems, reviewed] = await this.prisma.$transaction([
      this.prisma.problem.count(),
      this.prisma.currentReview.count({
        where: { userId },
      }),
    ]);

    return {
      totalProblems,
      reviewed,
      remaining: totalProblems - reviewed,
    };
  }

  async getTotalReviewsDone(userId: number) {
    return this.prisma.reviewHistory.count({
      where: { userId },
    });
  }
}
