import { Injectable } from '@nestjs/common';
import { User } from './generated/prisma/client';

@Injectable()
export class AppService {
  getHello(user: User): string {
    return user.clerkUserId;
  }
}
