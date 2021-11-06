import { AuditingBase } from 'src/auditingbase/auditingbase.interface';
import { Permission } from 'src/permissions/models/permission.entity';
import { Timestamp } from 'typeorm';

export interface Role extends AuditingBase {
  id: number;
  name: string;
  permissions?: Permission[];
}
