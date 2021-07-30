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

const userRelations = { relations: ['roles', 'roles.permissions'] };

@Injectable()
@Catch(QueryFailedError)
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private auth: AuthService,
  ) {}

  // create a new user
  createUser(user: User): Observable<Object> {
    return from(this.userRepository.save(user));
  }
  // find all users
  findAllUsers(): Observable<Object> {
    return from(this.userRepository.find({ ...userRelations })).pipe(
      map((users: UserEntity[]) => {
        users.forEach((user) => delete user.password);
        return users;
      }),
    );
  }
  // find single user by id
  findSingleUser(id: number): Observable<User> {
    return from(this.userRepository.findOne(id, { ...userRelations })).pipe(
      map((user: UserEntity) => {
        const { password, ...result } = user;
        return result;
      }),
    );
  }
  // find single user by username
  findSingleUserByUsername(username: String): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { username: username },
        ...userRelations,
      }),
    );
  }
  // find single user by email
  findSingleUserByEmail(email: String): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { email },
        ...userRelations,
      }),
    );
  }
  // update single user
  updateSingleUser(id: number, data: User): Observable<Object> {
    return from(this.userRepository.update(id, data));
  }
  // delete single user
  deleteUser(id: number): Observable<Object> {
    return from(this.userRepository.softDelete(id));
  }
  // login user
  login(email: string, password: string): Observable<Object> {
    return from(this.validateUser(email, password)).pipe(
      switchMap((user: User) => {
        delete user.password;
        return this.auth.generateJWT(user).pipe(
          map((jwt) => ({
            ...user,
            token: jwt,
            expires_at: this.auth.generateJWTExpireDate(),
            issued_at: new Date(),
          })),
        );
      }),
    );
  }
  // validate user credentials
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
              throw new UnauthorizedException({
                statusCode: 401,
                type: 'Unauthorized',
                message: 'Invalid Credentials!',
              });
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
