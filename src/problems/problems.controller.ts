import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import {
  Problem as ProblemModel,
  ReviewHistory as ReviewHistoryModel,
} from 'src/generated/prisma/client';
import { SearchProblemsDto } from '../dto/search-problems.dot';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async getProblemsList(
    @Query() query: SearchProblemsDto,
  ): Promise<ProblemModel[]> {
    const { search, page, limit } = query;
    const skip = (page - 1) * limit;

    return this.problemsService.problemsBySearch({
      search,
      skip,
      take: limit,
    });
  }

  @Get('history/all')
  async getProblemHistory(): Promise<ReviewHistoryModel[]> {
    return this.problemsService.getProblemHistoryAll();
  }

  @Get('history/:key')
  async getProblemHistoryByNumber(
    @Param('key') key: string,
  ): Promise<ReviewHistoryModel[]> {
    return this.problemsService.problemHistoryByNumber({
      key: Number(key),
    });
  }
}
