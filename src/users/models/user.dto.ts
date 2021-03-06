import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  firstname?: string;
  @ApiProperty()
  lastname?: string;
  @ApiProperty()
  username?: string;
  @ApiProperty()
  email?: string;
  @ApiProperty()
  password?: string;
}
export class UpdateUserDto {
  @ApiProperty()
  firstname: string;
  @ApiProperty()
  lastname: string;
  @ApiProperty()
  username: string;
}

export class LoginUserDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}

export class UserRoleDto {
  @ApiProperty()
  role_id: number;
}
export class UserRolesDto {
  @ApiProperty()
  roles: number[];
}
