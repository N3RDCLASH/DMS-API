import { Permission } from 'src/permissions/models/permission.entity';
import { Timestamp } from 'typeorm';

export interface Role {
  id: number;
  name: string;
  created_at?: Timestamp;

  updated_at?: Timestamp;

  deleted_at?: Timestamp;

  permissions?: Permission[];
}
