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
import { hasPermission } from 'src/auth/decorators/permissions.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserRoleDto, UserRolesDto } from '../models/user.dto';
import { RolesService } from 'src/roles/service/roles.service';
import { User } from '../models/user.interface';
import {
  CREATE_USER,
  DELETE_USER,
  READ_USER,
  UPDATE_USER,
} from 'src/permissions/constants/permissions.constants';
import { PermissionGuard } from 'src/auth/gaurds/permissions.guard';
import { Observable } from 'rxjs';

// http error handling
@UseFilters(new HttpExceptionFilter())
@UseGuards(JwtAuthGuard, PermissionGuard)
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
  @hasPermission(CREATE_USER)
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
  @hasPermission(READ_USER)
  getUsers(): Object {
    return this.usersService.findAllUsers();
  }

  getUserByUsername(@Param('username') username: String): Observable<User> {
    return this.usersService.findSingleUserByUsername(username);
  }

  @Get(':id')
  @hasPermission(READ_USER)
  getUserById(@Param('id') id: number): Observable<User> {
    if (!id || id == undefined || isNaN(id)) {
      throw new BadRequestException();
    } else {
      return this.usersService.findSingleUser(id);
    }
  }

  @Put(':id')
  @hasPermission(UPDATE_USER)
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
  @hasPermission(DELETE_USER)
  deleteUser(@Param('id') id: number): Object {
    return this.usersService.deleteUser(id);
  }

  @Post(':id/roles')
  @hasPermission(UPDATE_USER)
  async addRoleToUser(
    @Param('id') user_id: number,
    @Body() userRoleDto: UserRoleDto,
  ) {
    const { role_id } = userRoleDto;
    if (!role_id) throw new BadRequestException();

    const role = await this.roleService.findOneRole(role_id);
    return this.usersService.addRoleToUser(user_id, role);
  }
  @Post(':id/roles/multi')
  @hasPermission(UPDATE_USER)
  async addRolesToUser(
    @Param('id') user_id: number,
    @Body() userRolesDto: UserRolesDto,
  ) {
    const { roles } = userRolesDto;
    if (!roles) throw new BadRequestException();

    return this.usersService.addRolesToUser(user_id, roles);
  }

  @Delete(':id/roles')
  @hasPermission(UPDATE_USER)
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
