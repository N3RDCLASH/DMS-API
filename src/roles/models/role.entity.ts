import { AuditingBase } from 'src/auditingbase/auditingbase';
import { Permission } from 'src/permissions/models/permission.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity({ name: 'roles', synchronize: false })
export class Role extends AuditingBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_has_permissions',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  permissions: Permission[];
}
