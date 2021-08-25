import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { Permission } from 'src/permissions/models/permission.entity';
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
    const permissions = this.reflector.get<string[]>(
      'permission',
      context.getHandler(),
    );

    if (!permissions) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.userService.findSingleUser(user.id).pipe(
      map((user: User) => {
        const hasPermission = () => {
          //extract permissions from roles
          //flatten roles + persmission arrays and filter the permissions
          const userPermissions: Permission[] = user.roles
            .flatMap((item) => item)
            .filter((item) => item instanceof Permission);

          // search for permission in userpermissions
          const permissionsPassed = permissions
            .map((permission) => {
              return userPermissions?.filter((permissionToCompare: any) => {
                console.log(
                  'permission found:',
                  permissionToCompare.name == permission,
                );
                permissionToCompare.name == permission;
              })
                ? true
                : false;
            })
            .flat();

          // check if all permissions have passed
          const allPermissionsPassed = (): boolean => {
            console.log(
              'permissions passed',
              permissionsPassed,
              permissionsPassed.filter((permission) => permission == true)
                .length,
              'required permissions:',
              permissions,
              permissions.length,
            );
            if (
              permissionsPassed.filter((permission) => permission == true)
                .length == permissions.length
            ) {
              console.log(
                'all permissions passed:',
                permissionsPassed.filter((permission) => permission == true)
                  .length == permissions.length,
              );
              return true;
            }

            console.log(
              'all permissions passed:',
              permissionsPassed.filter((permission) => permission == true)
                .length == permissions.length,
            );
            return false;
          };

          return allPermissionsPassed();
        };
        return hasPermission();
      }),
    );
  }
}
