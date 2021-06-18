import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrorHandler } from '../middleware/errors';
import { HashingHelper } from 'src/middleware/hashing.helper';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, HashingHelper, ErrorHandler],
})
export class UsersModule {}
