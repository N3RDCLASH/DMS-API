import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PermissionsController } from './controlleres/permissions.controller';
import { Permission } from './models/permission.entity';
import { PermissionsService } from './service/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), AuthModule, UsersModule],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
