// import-csv.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const results: Prisma.CurrentReviewCreateManyInput[] = [];

  const csvFilePath = path.resolve('scripts/current_reviews.csv');

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row: any) => {
        const record: Prisma.CurrentReviewCreateManyInput = {
          userId: 1, // hardcoded userId
          problemNumber: Number(row.problem_number),
          nextReviewAt: new Date(row.next_review_at),
          stability: parseFloat(row.stability),
          difficulty: parseFloat(row.difficulty),
          elapsedDays: Number(row.elapsed_days),
          scheduledDays: Number(row.scheduled_days),
          reps: Number(row.reps),
          lapses: Number(row.lapses),
          learningSteps: Number(row.learning_steps),
          state: Number(row.state),
          lastReview: new Date(row.last_review),
        };

        results.push(record);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  const batchSize = 1000;
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);

    const res = await prisma.currentReview.createMany({
      data: batch,
      skipDuplicates: true,
    });

    console.log(`Inserted batch: ${res.count} problems`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
