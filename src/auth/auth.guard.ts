import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClerkClient, verifyToken } from '@clerk/backend';
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
    const clerkClient = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    });

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token = req.headers['authorization'].split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await verifyToken(token, {
        secretKey: this.configService.get('CLERK_SECRET_KEY'),
      });

      const user = await clerkClient.users.getUser(tokenPayload.sub);
      const clerkUserId = user.id;
      const firstName = user.firstName ?? '';
      const lastName = user.lastName ?? '';
      const fullName = `${firstName} ${lastName}`.trim();
      const email = user.emailAddresses[0]?.emailAddress;
      // TODO: Save to your DB if doesn't exist

      const dbUser = await this.userService.findOrCreate({
        clerkUserId,
        email,
        name: fullName,
      });

      // Attach user to request
      req.user = dbUser;

      return true;
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
