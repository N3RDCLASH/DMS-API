import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { Permission } from '../models/permission.entity';
import { PermissionsService } from '../service/permissions.service';

@UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}
  @Get()
  getAllPermissions() {
    return this.permissionsService.findAllPermissions();
  }
  @Get(':id')
  getOnePermissions(@Param('id') id: number) {
    return this.permissionsService.findOnePermission(id);
  }
}
