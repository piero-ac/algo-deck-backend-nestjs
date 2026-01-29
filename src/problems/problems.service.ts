import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Problem } from 'src/generated/prisma/client';
import { ReviewHistoryResponseDto } from 'src/dto/review-history-response.dto';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async problemsBySearch(params: {
    search: string;
    skip: number;
    take: number;
  }): Promise<Problem[]> {
    const { search, skip, take } = params;
    return this.prisma.problem.findMany({
      take,
      skip,
      where: {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            slug: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  async problemHistoryByNumber(params: {
    key: number;
  }): Promise<ReviewHistoryResponseDto[]> {
    const { key } = params;

    return this.prisma.reviewHistory.findMany({
      take: 10,
      where: {
        problemNumber: key,
      },
      orderBy: {
        reviewedAt: 'desc',
      },
      select: {
        id: true,
        problemNumber: true,
        rating: true,
        reviewedAt: true,
        problem: {
          select: {
            title: true,
          },
        },
      },
    });
  }

  async getProblemHistoryAll(): Promise<ReviewHistoryResponseDto[]> {
    return this.prisma.reviewHistory.findMany({
      take: 10,
      orderBy: {
        reviewedAt: 'desc',
      },
      select: {
        id: true,
        problemNumber: true,
        rating: true,
        reviewedAt: true,
        problem: {
          select: {
            title: true,
          },
        },
      },
    });
  }
}
