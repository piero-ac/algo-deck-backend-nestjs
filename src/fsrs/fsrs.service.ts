import { Injectable } from '@nestjs/common';
import { ReviewCardDto } from 'src/dto/review-card.dto';
import { CurrentReviewDto } from 'src/dto/current-review.dto';
import { ReviewHistoryDto } from 'src/dto/review-history.dto';
import { Rating as PrismaRating } from 'src/generated/prisma/client';

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating as FsrsRating,
  Card,
  FSRSParameters,
  RecordLogItem,
  ReviewLog,
} from 'ts-fsrs';

@Injectable()
export class FsrsService {
  private params: FSRSParameters = generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
  });

  private fsrs = fsrs(this.params);

  rowToCard(data: ReviewCardDto): Card {
    return {
      due: data.nextReviewAt,
      stability: data.stability,
      difficulty: data.difficulty,
      elapsed_days: data.elapsedDays,
      scheduled_days: data.scheduledDays,
      reps: data.reps,
      lapses: data.lapses,
      learning_steps: data.learningSteps,
      state: data.state,
      last_review: data.lastReview ?? new Date(),
    };
  }

  schedule(card: Card, rating: FsrsRating): RecordLogItem {
    const cards = this.fsrs.repeat(card, new Date());
    let item;

    for (const c of cards) {
      if (c.log.rating === rating) {
        item = c;
      }
    }

    return item as RecordLogItem;
  }

  // Convert Card Row Data for Current Reviews
  cardToRowForCurrentReviews(
    card: Card,
    userId: number,
    problemNumber: number,
  ): CurrentReviewDto {
    return {
      userId,
      problemNumber,
      learningSteps: card.learning_steps,
      nextReviewAt: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsedDays: card.elapsed_days,
      scheduledDays: card.scheduled_days,
      reps: card.reps,
      lapses: card.lapses,
      state: card.state,
      lastReview: card.last_review ?? new Date(),
    };
  }
  // Convert Card to Row Data for
  cardToRowForReviewHistory(
    log: ReviewLog,
    userId: number,
    problemNumber: number,
  ): ReviewHistoryDto {
    return {
      userId,
      rating: this.fsrsRatingToPrisma(log.rating),
      state: log.state,
      due: log.due,
      stability: log.stability,
      difficulty: log.difficulty,
      elapsedDays: log.elapsed_days,
      lastElapsedDays: log.last_elapsed_days,
      scheduledDays: log.scheduled_days,
      learningSteps: log.learning_steps,
      review: log.review,
      problemNumber,
      reviewedAt: log.review,
      comments: '',
    };
  }

  // Create empty card
  createNewCard() {
    return createEmptyCard(new Date());
  }

  mapPrismaRatingToFsrs(rating: PrismaRating): FsrsRating {
    switch (rating) {
      case PrismaRating.ONE:
        return FsrsRating.Again;
      case PrismaRating.TWO:
        return FsrsRating.Hard;
      case PrismaRating.THREE:
        return FsrsRating.Good;
      case PrismaRating.FOUR:
        return FsrsRating.Easy;
      default:
        return FsrsRating.Again;
    }
  }

  fsrsRatingToPrisma(rating: FsrsRating): PrismaRating {
    switch (rating) {
      case FsrsRating.Again:
        return PrismaRating.ONE;
      case FsrsRating.Hard:
        return PrismaRating.TWO;
      case FsrsRating.Good:
        return PrismaRating.THREE;
      case FsrsRating.Easy:
        return PrismaRating.FOUR;
      default:
        throw new Error(`Unsupported FSRS rating: ${rating}`);
    }
  }
  mapNumberToFsrs(rating: number): FsrsRating {
    switch (rating) {
      case 1:
        return FsrsRating.Again;
      case 2:
        return FsrsRating.Hard;
      case 3:
        return FsrsRating.Good;
      case 4:
        return FsrsRating.Easy;
      default:
        return FsrsRating.Manual; // use Manual to Determine error
    }
  }
}
