import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users/service/users.service';
import { AppService } from './app.service';
import { LoginUserDto } from './users/models/user.dto';

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
  login(@Body() loginUserDto: LoginUserDto): Object {
    const { email, password } = loginUserDto;
    return this.userService.login(email, password);
  }
}
