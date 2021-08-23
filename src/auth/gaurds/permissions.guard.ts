import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permission = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );

    if (!permission) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.userService.findSingleUser(user.id).pipe(
      map((user: User) => {
        // references: https://stackoverflow.com/a/25926600/13205801 &&
        // https://github.com/ThomasOliver545/Blog-with-NestJS-and-Angular/blob/master/api/src/auth/guards/roles.guard.ts
        const hasPermission = () => {
          // get  permissions from roles
          const userPermissions = user.roles.map((role) => role.permissions);
          // search for permission in userpermissions
          return userPermissions?.find(
            (permissionToCompare: any) =>
              permissionToCompare.name == permission,
          )?.[0]
            ? true
            : false;
        };

        return hasPermission();
      }),
    );
  }
}
