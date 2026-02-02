import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOrCreate(params: {
    clerkUserId: string;
    email: string;
    name: string;
  }): Promise<UserModel> {
    const { clerkUserId, email, name } = params;

    const user = await this.prisma.user.findFirst({
      where: {
        clerkUserId,
        email,
      },
    });

    if (user === null) {
      // create user
      const newUser = await this.prisma.user.create({
        data: { clerkUserId, email, name },
      });
      return newUser;
    } else {
      return user;
    }
  }
}
