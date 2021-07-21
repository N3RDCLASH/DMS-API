import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/users/models/user.entity';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.userService.findSingleUser(user.id).pipe(
      map((user: User) => {
        // references: https://stackoverflow.com/a/25926600/13205801 &&
        // https://github.com/ThomasOliver545/Blog-with-NestJS-and-Angular/blob/master/api/src/auth/guards/roles.guard.ts

        const hasRole = () =>
          roles.some((role) => user.roles.find((x) => role == x.name));
        let hasPermission: boolean = false;

        if (hasRole()) {
          hasPermission = true;
        }
        console.log({ hasPermission });
        return user && hasPermission;
      }),
    );
  }
}
