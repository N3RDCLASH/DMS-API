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
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Role } from 'src/roles/models/role.entity';

const userRelations = { relations: ['roles', 'roles.permissions'] };

@Injectable()
@Catch(QueryFailedError)
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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
      mergeMap((user: User) => {
        if (user) {
          return forkJoin({
            user: of(user),
            match: this.auth.comparePasswords(password, user.password),
          });
        }

        throw new UnauthorizedException({
          statusCode: 401,
          type: 'Unauthorized',
          message: 'Invalid Credentials!',
        });
      }),

      map(({ user, match }) => {
        if (match) return user;

        throw new UnauthorizedException({
          statusCode: 401,
          type: 'Unauthorized',
          message: 'Invalid Credentials!',
        });
      }),
    );
  }

  // todo:rewrite reactively
  addRoleToUser(user_id: number, role: Role) {
    return from(this.userRepository.findOne(user_id, userRelations)).pipe(
      map((user) => {
        user.roles.push(role);
        return this.userRepository.save(user);
      }),
      catchError((error) => of(error)),
    );
  }
  addRolesToUser(user_id: number, roles: number[]) {
    return forkJoin({
      user: this.userRepository.findOne(user_id, userRelations),
      rolesToAdd: this.roleRepository.findByIds(roles),
    }).pipe(
      map(({ user, rolesToAdd }) => {
        console.log(roles, rolesToAdd);
        user.roles = [...rolesToAdd];
        return this.userRepository.save(user);
      }),
      catchError((error) => of(error)),
    );
  }

  // todo:rewrite reactively
  removeRoleFromUser(user_id: number, roleToRemove: Role) {
    // filter role to remove out of roles array
    return from(this.userRepository.findOne(user_id, userRelations)).pipe(
      map((user) => {
        console.log(user);
        user.roles = user.roles.filter((role) => role.id !== roleToRemove.id);
        return this.userRepository.save(user);
      }),
    );
  }
}
