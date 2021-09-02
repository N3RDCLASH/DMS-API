import { Column, DeleteDateColumn, Timestamp, UpdateDateColumn } from 'typeorm';

export class AuditingBase {
  @Column({ type: 'timestamp' })
  created_at: Timestamp;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Timestamp;
  @Column({ type: 'timestamp' })
  @DeleteDateColumn()
  deleted_at: Timestamp;
  @Column()
  created_by: String;
  @Column()
  updated_by: String;
}
