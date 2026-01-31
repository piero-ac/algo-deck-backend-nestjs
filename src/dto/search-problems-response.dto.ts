export class SearchProblemsResponseDto {
  problems: { number: number; title: string; difficulty: string }[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
