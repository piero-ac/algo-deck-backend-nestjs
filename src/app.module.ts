import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProblemsService } from './problems/problems.service';
import { ProblemsController } from './problems/problems.controller';
import { PrismaService } from './prisma/prisma.service';
import { ReviewsController } from './reviews/reviews.controller';
import { ReviewsService } from './reviews/reviews.service';
import { FsrsService } from './fsrs/fsrs.service';
import { ReviewStatsService } from './reviews/review-stats.service';
import { UsersService } from './users/users.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 30,
        },
      ],
    }),
  ],
  controllers: [AppController, ProblemsController, ReviewsController],
  providers: [
    AppService,
    ProblemsService,
    PrismaService,
    ReviewsService,
    FsrsService,
    ReviewStatsService,
    UsersService,
  ],
})
export class AppModule {}
