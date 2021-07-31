import { Role } from 'src/roles/models/role.entity';
import { Timestamp } from 'typeorm';

export interface User {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  created_at?: Timestamp;

  updated_at?: Timestamp;

  deleted_at?: Timestamp;
  roles?: Role[];
}
