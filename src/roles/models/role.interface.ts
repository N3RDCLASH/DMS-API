import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty()
  name: string;
}

export class CreateRolePermissionDto {
  @ApiProperty()
  permission_id: number;
}

