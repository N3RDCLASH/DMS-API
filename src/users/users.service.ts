import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { User as UserModel } from './user.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
// import { ErrorHandler } from '../../middleware/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>, // private errorHandler: ErrorHandler,
  ) {}

  async createUser(user: UserModel): Promise<Object> {
    return this.userRepository.save(user);
  }

  async findAllUsers(): Promise<Object> {
    return this.userRepository.find();
  }

  async findSingleUser(id: number): Promise<Object> {
    // return this.errorHandler.hasResource(await this.userRepository.findOne(id));
    return await this.userRepository.findOne(id);
  }

  async updateSingleUser(id: number, data: UserModel): Promise<Object> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: number): Promise<Object> {
    return this.userRepository.delete(id);
  }
}
