import { Controller, Get, Query } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { Problem as ProblemModel } from 'src/generated/prisma/client';
import { SearchProblemsDto } from '../dto/search-problems.dot';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async getProblemsByQueryParams(
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
}
