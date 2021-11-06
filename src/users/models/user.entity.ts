import { AuditingBase } from 'src/auditingbase/auditingbase';
import { Role } from 'src/roles/models/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';

@Entity({ name: 'users', synchronize: false })
export class User extends AuditingBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;
  
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_has_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  roles: Role[];
}
