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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { PermissionsService } from 'src/permissions/service/permissions.service';
import { Role } from '../models/role.entity';
import { CreateRoleDto } from '../models/role.dto';
import { CreateRolePermissionDto } from '../models/role.dto';
import { RoleBuilder } from '../role.builder';
import { RolesService } from '../service/roles.service';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionService: PermissionsService,
  ) {}
  // TODO: rewrite using dto
  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
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
  updateOneRole(@Param('id') id: number, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.updateOneRole(id, createRoleDto);
  }

  @Delete(':id')
  deleteOneRole(@Param('id') id: number) {
    return this.rolesService.deleteOneRole(id);
  }

  // TODO: add/remove permission to role
  @Post(':id/permissions')
  async addPermissionToRole(
    @Param('id') role_id: number,
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    const { permission_id } = createRolePermissionDto;
    const role = await this.getOneRole(role_id);
    const permission = await this.permissionService.findOnePermission(
      permission_id,
    );
    return this.rolesService.addPermissiontoRole(role, permission);
  }

  @Delete(':id/permissions')
  async removePermissionFromRole(
    @Param('id') role_id: number,
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    const { permission_id } = createRolePermissionDto;
    const role = await this.getOneRole(role_id);
    const permission = await this.permissionService.findOnePermission(
      permission_id,
    );
    return this.rolesService.removePermissionfromRole(role, permission);
  }
}
