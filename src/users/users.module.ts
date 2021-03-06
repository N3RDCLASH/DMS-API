import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './models/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './service/users.service';
import { RolesService } from 'src/roles/service/roles.service';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/models/role.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
