import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { SearchProblemsDto } from '../dto/search-problems.dto';
import { ReviewHistoryResponseDto } from '../dto/review-history-response.dto';
import { SearchProblemsResponseDto } from 'src/dto/search-problems-response.dto';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async getProblemsList(
    @Query() query: SearchProblemsDto,
  ): Promise<SearchProblemsResponseDto> {
    const { search, page, limit } = query;
    const skip = (page - 1) * limit;

    const { problems, total } = await this.problemsService.problemsBySearch({
      search,
      skip,
      take: limit,
    });

    return {
      problems,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('history/all/:userId')
  async getProblemHistory(
    @Param('userId') userId: string,
  ): Promise<ReviewHistoryResponseDto[]> {
    return this.problemsService.getProblemHistoryAll(Number(userId));
  }

  @Get('history/:key')
  async getProblemHistoryByNumber(
    @Param('key') key: string,
  ): Promise<ReviewHistoryResponseDto[]> {
    return this.problemsService.problemHistoryByNumber({
      key: Number(key),
    });
  }
}
