import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Problem, ReviewHistory } from 'src/generated/prisma/client';

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
  }): Promise<ReviewHistory[]> {
    const { key } = params;

    return this.prisma.reviewHistory.findMany({
      take: 10,
      where: {
        problemNumber: key,
      },
    });
  }

  async getProblemHistoryAll(): Promise<ReviewHistory[]> {
    return this.prisma.reviewHistory.findMany({
      take: 10,
    });
  }
}
