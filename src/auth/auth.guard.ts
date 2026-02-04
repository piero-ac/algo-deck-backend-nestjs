import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/generated/prisma/client';

export interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private readonly configService: ConfigService,
  ) {} // Inject your service

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Get token from header
    const authHeader = request.headers['authorization'] as string | undefined;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('No token');
    }

    try {
      // Verify token with Clerk
      const verified = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY as string,
        issuer: `https://${process.env.CLERK_DOMAIN}`,
      });

      // Get user from Clerk
      const clerkUser = await clerkClient.users.getUser(verified.sub);
      // Safely extract user data
      const clerkUserId = clerkUser.id;
      const firstName = clerkUser.firstName ?? '';
      const lastName = clerkUser.lastName ?? '';
      const fullName = `${firstName} ${lastName}`.trim();
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      // TODO: Save to your DB if doesn't exist

      const dbUser = await this.userService.findOrCreate({
        clerkUserId,
        email,
        name: fullName,
      });

      // Attach user to request
      request.user = dbUser;

      return true;
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
