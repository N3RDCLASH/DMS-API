import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { PermissionsService } from 'src/permissions/service/permissions.service';
import { Role } from '../models/role.entity';
import { RoleBuilder } from '../role.builder';
import { RolesService } from '../service/roles.service';
@UseGuards(JwtAuthGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionService: PermissionsService,
  ) {}
  // TODO: rewrite using dto
  @Post()
  createRole(@Body() body) {
    const { name } = body;
    if (!name) {
      throw BadRequestException;
    }
    const role = new RoleBuilder().setName(name).build();
    return this.rolesService.createRole(role);
  }
  @Get()
  getAllRoles(): Object {
    return this.rolesService.findAllRoles();
  }
  @Get(':id')
  async getOneRole(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.findOneRole(id);
  }
  @Put(':id')
  updateOneRole(@Param('id') id: number, @Body() body) {
    const { name } = body;
    if (!name) {
      throw BadRequestException;
    }
    const role = new RoleBuilder().setName(name).build();
    return this.rolesService.updateOneRole(id, role);
  }

  @Delete(':id')
  deleteOneRole(@Param('id') id: number) {
    return this.rolesService.deleteOneRole(id);
  }

  // TODO: add/remove permission to role
  @Post(':id/permission')
  async addPermissionToRole(@Param('id') role_id: number, @Body() body) {
    const role = await this.getOneRole(role_id);
    const permission = await this.permissionService.findOnePermission(
      body.permission_id,
    );
    return this.rolesService.addPermissiontoRole(role, permission);
  }

  @Delete(':id/permission')
  async removePermissionFromRole(@Param('id') role_id: number, @Body() body) {
    const role = await this.getOneRole(role_id);
    const permission = await this.permissionService.findOnePermission(
      body.permission_id,
    );
    return this.rolesService.removePermissionfromRole(role, permission);
  }
}
