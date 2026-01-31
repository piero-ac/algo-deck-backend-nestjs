import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
// import { Problem } from 'src/generated/prisma/client';
import { ReviewHistoryResponseDto } from 'src/dto/review-history-response.dto';

@Injectable()
export class ProblemsService {
  constructor(private prisma: PrismaService) {}

  async getProblemsCount(): Promise<number> {
    return this.prisma.problem.count();
  }

  async problemsBySearch(params: {
    search: string;
    skip: number;
    take: number;
    userId: number;
  }): Promise<ProblemsBySearchResponse> {
    const { search, skip, take, userId } = params;
    const whereClause: Prisma.ProblemWhereInput = {
      AND: [
        {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              slug: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        {
          reviewHistories: {
            none: {
              userId,
            },
          },
        },
      ],
    };

    const [problems, total] = await this.prisma.$transaction([
      this.prisma.problem.findMany({
        take,
        skip,
        select: {
          number: true,
          title: true,
          difficulty: true,
        },
        where: whereClause,
      }),
      this.prisma.problem.count({
        where: whereClause,
      }),
    ]);

    return { problems, total };
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

  async getProblemHistoryAll(
    userId: number,
  ): Promise<ReviewHistoryResponseDto[]> {
    return this.prisma.reviewHistory.findMany({
      take: 10,
      where: {
        userId: userId,
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
}

export type ProblemSearchResult = {
  number: number;
  title: string;
  difficulty: string;
};

export type ProblemsBySearchResponse = {
  problems: ProblemSearchResult[];
  total: number;
};
