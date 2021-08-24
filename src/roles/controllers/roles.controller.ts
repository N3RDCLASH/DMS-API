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
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { PermissionsService } from 'src/permissions/service/permissions.service';
import { Role } from '../models/role.entity';
import { CreateRoleDto } from '../models/role.dto';
import { CreateRolePermissionDto } from '../models/role.dto';
import { RolesService } from '../service/roles.service';
import { RolesGuard } from 'src/auth/gaurds/roles.guard';
import { forkJoin, from, merge, Observable } from 'rxjs';
import { response } from 'express';

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
  getOneRole(@Param('id') id: number) {
    return this.rolesService.findOneRole(id);
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

    const data = {
      role: from(this.getOneRole(role_id)),
      permission: from(this.permissionService.findOnePermission(permission_id)),
    };
    forkJoin(data).subscribe(({ role, permission }) =>
      console.log(this.rolesService.addPermissiontoRole(role, permission)),
    );
  }

  @Delete(':id/permissions')
  async removePermissionFromRole(
    @Param('id') role_id: number,
    @Body() createRolePermissionDto: CreateRolePermissionDto,
  ) {
    const { permission_id } = createRolePermissionDto;

    const data = {
      role: from(this.getOneRole(role_id)),
      permission: from(this.permissionService.findOnePermission(permission_id)),
    };

    forkJoin(data).subscribe(({ role, permission }) =>
      this.rolesService.removePermissionfromRole(role, permission),
    );
  }
}
