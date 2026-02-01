// src/scripts/import-csv.ts
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PrismaClient, Prisma } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

console.log('DATABASE_URL:', process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) throw new Error('.env DATABASE_URL not found!');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  const results: Prisma.ProblemCreateManyInput[] = [];
  const csvFilePath = path.join(__dirname, 'problems.csv'); // CSV in same folder as script

  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row: any) => {
        const record: Prisma.ProblemCreateManyInput = {
          number: Number(row.problem_number),
          title: row.problem_title,
          slug: row.problem_slug,
          description: row.problem_description ?? '',
          topics: row.problem_topics ?? '',
          difficulty: row.problem_difficulty,
          similarProblemNumbers: row.similar_problem_number ?? '',
          similarProblemTexts: row.similar_problem_text ?? '',
        };
        results.push(record);
      })
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });

  const batchSize = 1000;
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const res = await prisma.problem.createMany({
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
