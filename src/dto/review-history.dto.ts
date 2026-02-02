import { Rating } from 'src/generated/prisma/enums';

export class ReviewHistoryDto {
  userId: number;
  problemNumber: number;
  rating: Rating;
  reviewedAt: Date;
  comments: string;
  state: number;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  due: Date;
  lapses: number;
  lastReview: Date | null;
  reps: number;
}
