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
import { UsersService } from './users.service';
import { UserBuilder } from './user.builder';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

// http error handling
@UseFilters(new HttpExceptionFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  createUser(@Body() body: any): Object {
    const { firstname, lastname, username, password, email } = body;

    // TODO: check if user already exists

    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .setEmail(email)
      .setPassword(password)
      .build();

    return this.usersService.createUser(user);
  }
  @Get()
  getUsers(): Object {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Object {
    return this.usersService.findSingleUser(id);
  }
  @Put(':id')
  updateUserById(@Param('id') id: number, @Body() body): Object {
    const { firstname, lastname, username, password, email } = body;
    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .setEmail(email)
      .setPassword(password)
      .build();
      
    return this.usersService.updateSingleUser(id, user);
  }
  @Delete(':id')
  deleteUser(@Param('id') id: number): Object {
    return this.usersService.deleteUser(id);
  }
}
