import { Timestamp } from 'typeorm';

export interface AuditingBase {
  created_at?: Timestamp;
  updated_at?: Timestamp;
  deleted_at?: Timestamp;
}
