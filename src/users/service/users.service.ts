import { BadRequestException, Catch, Injectable } from '@nestjs/common';
import { User as UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
@Catch(QueryFailedError)
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private auth: AuthService,
  ) {}

  createUser(user: User): Observable<Object> {
    return from(this.userRepository.save(user));
  }

  findAllUsers(): Observable<Object> {
    return from(this.userRepository.find()).pipe(
      map((users: UserEntity[]) => {
        users.forEach((user) => delete user.password);
        return users;
      }),
    );
  }

  findSingleUser(id: number): Observable<User> {
    return from(this.userRepository.findOne(id)).pipe(
      map((user: UserEntity) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }
  findSingleUserByUsername(username: String): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { username: username },
      }),
    );
  }

  updateSingleUser(id: number, data: User): Observable<Object> {
    delete data.email;
    delete data.password;
    return from(this.userRepository.update(id, data));
  }

  deleteUser(id: number): Observable<Object> {
    return from(this.userRepository.delete(id));
  }

  login(username: string, password: string): Observable<String> {
    return from(this.validateUser(username, password)).pipe(
      switchMap((user: User) => {
        return this.auth.generateJWT(user).pipe(map((jwt) => jwt));
      }),
    );
  }

  validateUser(username: string, password: string) {
    if (!username)
      throw new BadRequestException({
        statusCode: 400,
        type: 'bad request',
        message: 'Please enter a username!',
      });

    if (!password)
      throw new BadRequestException({
        statusCode: 400,
        type: 'bad request',
        message: 'Please enter a password!',
      });

    return from(this.findSingleUserByUsername(username)).pipe(
      map((user: User) => {
        if (user) {
          const match = this.auth.comparePasswords(password, user.password);
          if (match) {
            return user;
          }
          throw new BadRequestException({
            statusCode: 400,
            type: 'bad request',
            message: 'Invalid Credentials!',
          });
        }
      }),
    );
  }
}
