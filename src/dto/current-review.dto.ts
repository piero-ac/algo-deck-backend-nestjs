export class CurrentReviewDto {
  userId: number;
  problemNumber: number;
  nextReviewAt: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  learningSteps: number;
  state: number;
  lastReview: Date | undefined;
}
