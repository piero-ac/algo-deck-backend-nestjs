export class ReviewsDueDto {
  userId: number;
  problemNumber: number;
  problem: {
    title: string;
  };
}
