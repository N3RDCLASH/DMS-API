import { AuditingBase } from 'src/auditingbase/auditingbase.interface';

export interface Permission extends AuditingBase {
  name?: string;
}
