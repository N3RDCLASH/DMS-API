import { AuditingBase } from 'src/auditingbase/auditingbase.interface';
import { Role } from 'src/roles/models/role.entity';
import { Timestamp } from 'typeorm';

export interface User extends AuditingBase {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: Role[];
}
