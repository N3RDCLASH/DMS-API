import {
  BadRequestException,
  Catch,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    return from(this.userRepository.find({ relations: ["roles"] })).pipe(
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
  findSingleUserByEmail(email: String): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { email },
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

  login(email: string, password: string): Observable<Object> {
    return from(this.validateUser(email, password)).pipe(
      switchMap((user: User) => {
        delete user.password;
        return this.auth
          .generateJWT(user)
          .pipe(map((jwt) => ({ ...user, token: jwt })));
      }),
    );
  }

  validateUser(email: string, password: string) {
    if (!email)
      throw new BadRequestException({
        statusCode: 400,
        type: 'bad request',
        message: 'Please enter a email!',
      });

    if (!password)
      throw new BadRequestException({
        statusCode: 400,
        type: 'bad request',
        message: 'Please enter a password!',
      });

    return from(this.findSingleUserByEmail(email)).pipe(
      switchMap((user: User) => {
        if (user)
          return this.auth.comparePasswords(password, user.password).pipe(
            map((match: Boolean) => {
              if (match) return user;
              throw new UnauthorizedException();
            }),
          );

        throw new UnauthorizedException({
          statusCode: 401,
          type: 'Unauthorized',
          message: 'Invalid Credentials!',
        });
      }),
    );
  }
}
