import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  Inject,
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
import { CreateUserDto, UpdateUserDto, UserRoleDto } from '../models/user.dto';
import { RolesService } from 'src/roles/service/roles.service';
import { User } from '../models/user.interface';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// http error handling
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
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

  getUserByUsername(@Param('username') username: String): Observable<User> {
    return this.usersService.findSingleUserByUsername(username);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Observable<User> {
    if (!id || id == undefined || isNaN(id)) {
      throw new BadRequestException();
    } else {
      return this.usersService.findSingleUser(id);
    }
  }
  @Put(':id')
  async updateUserById(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Object> {
    const { firstname, lastname, username } = updateUserDto;
    if (!firstname || !lastname || !username) {
      throw new BadRequestException();
    }
    // builder pattern
    let user = new UserBuilder()
      .setFirstName(firstname)
      .setLastName(lastname)
      .setUserName(username)
      .build();

    delete user.email;
    delete user.password;
    return this.usersService.updateSingleUser(id, user);
  }
  @Delete(':id')
  @hasRole('admin')
  deleteUser(@Param('id') id: number): Object {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/roles')
  async addRoleToUser(
    @Param('id') user_id: number,
    @Body() userRoleDto: UserRoleDto,
  ) {
    const { role_id } = userRoleDto;
    if (!role_id) throw new BadRequestException();

    const role = await this.roleService.findOneRole(role_id);
    return this.usersService.addRoleToUser(user_id, role);
  }

  @Delete(':id/roles')
  async removeRoleFromUser(
    @Param('id') user_id: number,
    @Body() userRoleDto: UserRoleDto,
  ) {
    const { role_id } = userRoleDto;

    if (!role_id) throw new BadRequestException();

    const role = await this.roleService.findOneRole(role_id);
    return this.usersService.removeRoleFromUser(user_id, role);
  }
}
