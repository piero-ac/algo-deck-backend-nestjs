import { Rating } from 'src/generated/prisma/enums';

export class ReviewHistoryResponseDto {
  id: number;
  problemNumber: number;
  rating: Rating;
  reviewedAt: Date;
  problem: {
    title: string;
  };
}
