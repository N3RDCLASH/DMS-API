import { AuditingBase } from 'src/auditingbase/auditingbase';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'permissions', synchronize: false })
export class Permission extends AuditingBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
