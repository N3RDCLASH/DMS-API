import { Permission } from 'src/permissions/models/permission.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'roles', synchronize: false })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ type: 'timestamp' })
  created_at: Timestamp;

  @Column({ type: 'timestamp' })
  updated_at: Timestamp;

  @Column({ type: 'timestamp' })
  deleted_at: Timestamp;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_has_permissions',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }],
  })
  permissions: Permission[];
}
