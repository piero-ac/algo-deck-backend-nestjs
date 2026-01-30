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
  lastElapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  due: Date;
  review: Date;
}
