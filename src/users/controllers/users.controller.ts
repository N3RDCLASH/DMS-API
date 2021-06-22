import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserBuilder } from '../user.builder';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { AuthService as Auth } from 'src/auth/auth.service';
import { Observable } from 'rxjs';

// http error handling
@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private auth: Auth,
  ) {}
  @Post()
  async createUser(@Body() body): Promise<Object> {
    const { firstname, lastname, username, password, email } = body;
    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .setEmail(email)
      .setPassword(await this.auth.hashPassword(password))
      .build();

    return this.usersService.createUser(user);
  }
  @Get()
  getUsers(): Object {
    return this.usersService.findAllUsers();
  }

  @Get()
  getUserByUsername(@Param('username') username: String): Object {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Object {
    return this.usersService.findSingleUser(id);
  }
  @Put(':id')
  async updateUserById(@Param('id') id: number, @Body() body): Promise<Object> {
    const { firstname, lastname, username, password, email } = body;
    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .setEmail(email)
      .setPassword(await this.auth.hashPassword(password))
      .build();
    return this.usersService.updateSingleUser(id, user);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number): Object {
    return this.usersService.deleteUser(id);
  }
}
