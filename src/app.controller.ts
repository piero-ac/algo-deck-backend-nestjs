import {
  Controller,
  Get,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard, type RequestWithUser } from './auth/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() request: RequestWithUser) {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const aunthenticatedUser = request.user;

    const userId = this.appService.getHello(aunthenticatedUser);

    return userId;
  }
}
