import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ErrorHandler } from '../middleware/errors';
import { User } from './models/user.entity';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './service/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, ErrorHandler],
  exports: [UsersService],
})
export class UsersModule {}
