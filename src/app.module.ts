import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ProblemsService } from './problems/problems.service';
import { ProblemsController } from './problems/problems.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, ProblemsController],
  providers: [AppService, ProblemsService, PrismaService],
})
export class AppModule {}
