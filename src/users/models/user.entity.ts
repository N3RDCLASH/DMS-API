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
export class User {
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

  @Column({ type: 'timestamp' })
  created_at: Timestamp;

  @Column({ type: 'timestamp' })
  updated_at: Timestamp;

  @Column({ type: 'timestamp' })
  @DeleteDateColumn()
  deleted_at: Timestamp;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_has_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }],
  })
  roles: Role[];
}
