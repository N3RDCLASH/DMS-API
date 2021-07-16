import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { RolesController } from './controllers/roles.controller';
import { Role } from './models/role.entity';
import { RolesService } from './service/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), UsersModule],
  providers: [RolesService],
  controllers: [RolesController],
})
export class RolesModule {}
