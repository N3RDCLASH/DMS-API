import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users/service/users.service';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/gaurds/jwt-auth.gaurd';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')
  login(@Body() body): Object {
    const { username, password } = body;
    return this.userService.login(username, password);
  }
}
