import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { RolesController } from './controllers/roles.controller';
import { Role } from './models/role.entity';
import { RolesService } from './service/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule, PermissionsModule],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
