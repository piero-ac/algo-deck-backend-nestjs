import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { SearchProblemsDto } from '../dto/search-problems.dto';
import { ReviewHistoryResponseDto } from '../dto/review-history-response.dto';
import { SearchProblemsResponseDto } from 'src/dto/search-problems-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/generated/prisma/client';
import { type RequestWithUser } from 'src/auth/auth.guard';

@Controller('problems')
@UseGuards(AuthGuard)
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async getProblemsList(
    @Query() query: SearchProblemsDto,
    @Request() request: RequestWithUser,
  ): Promise<SearchProblemsResponseDto> {
    const { search, page, limit } = query;
    const skip = (page - 1) * limit;

    const authenticatedUser = request.user as User;

    const { problems, total } = await this.problemsService.problemsBySearch({
      search,
      skip,
      take: limit,
      userId: authenticatedUser.id,
    });

    return {
      problems,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('history/all')
  async getProblemHistory(
    @Param('userId') userId: string,
    @Request() request: RequestWithUser,
  ): Promise<ReviewHistoryResponseDto[]> {
    const authenticatedUser = request.user as User;
    return this.problemsService.getProblemHistoryAll(authenticatedUser.id);
  }

  @Get('history/:key')
  async getProblemHistoryByNumber(
    @Param('key') key: string,
    @Request() request: RequestWithUser,
  ): Promise<ReviewHistoryResponseDto[]> {
    const authenticatedUser = request.user as User;
    return this.problemsService.problemHistoryByNumber({
      key: Number(key),
      userId: authenticatedUser.id,
    });
  }
}
