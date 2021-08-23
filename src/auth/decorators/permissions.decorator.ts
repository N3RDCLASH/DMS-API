import { SetMetadata } from '@nestjs/common';

export const hasPermission = (...permission: string[]) =>
  SetMetadata('permission', permission);
