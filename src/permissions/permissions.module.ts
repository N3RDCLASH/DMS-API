import { Module } from '@nestjs/common';
import { PermissionsController } from './controlleres/permissions.controller';
import { PermissionsService } from './service/permissions.service';

@Module({
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
