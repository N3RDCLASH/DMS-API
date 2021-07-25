import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { UserBuilder } from '../user.builder';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { AuthService as Auth } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { hasRole } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '../models/user.interface';

// http error handling
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private auth: Auth,
  ) {}
  @Post()
  @hasRole('admin')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<Object> {
    // todo: rewrite using OpenApi DTO
    const { firstname, lastname, username, password, email } = createUserDto;
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
  @hasRole('admin')
  getUsers(): Object {
    return this.usersService.findAllUsers();
  }

  @Get()
  getUserByUsername(@Param('username') username: String): Object {
    return this.usersService.findSingleUserByUsername(username);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Object {
    return this.usersService.findSingleUser(id);
  }
  @Put(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Object> {
    const { firstname, lastname, username } = updateUserDto;
    if (!firstname || !lastname || !username) {
      throw BadRequestException;
    }
    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .build();
    return this.usersService.updateSingleUser(id, user);
  }
  @Delete(':id')
  @hasRole('admin')
  deleteUser(@Param('id') id: number): Object {
    return this.usersService.deleteUser(id);
  }
}
