import { Column, DeleteDateColumn, Timestamp } from 'typeorm';

export class AuditingBase {
  @Column({ type: 'timestamp' })
  created_at: Timestamp;
  @Column({ type: 'timestamp' })
  updated_at: Timestamp;
  @Column({ type: 'timestamp' })
  @DeleteDateColumn()
  deleted_at: Timestamp;
}
