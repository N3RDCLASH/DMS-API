import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Role } from './models/role.entity';
import { UserHasRoles } from './models/user_has_roles.entity';
import { RolesService } from './service/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserHasRoles]), UsersModule],
  providers: [RolesService],
})
export class RolesModule {}
