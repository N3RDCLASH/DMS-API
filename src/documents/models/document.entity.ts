import { type } from 'os';
import { User } from 'src/users/models/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Timestamp,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity({ name: 'documents', synchronize: false })
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file: string;

  @Column()
  owner_id: number;

  @Column({ type: 'timestamp' })
  created_at: Timestamp;

  @Column({ type: 'timestamp' })
  updated_at: Timestamp;

  @Column({ type: 'timestamp' })
  deleted_at: Timestamp;
  @ManyToMany((type) => User)
  @JoinTable({
    name: 'document_shared_with_user',
    joinColumns: [{ name: 'document_id' }],
    inverseJoinColumns: [{ name: 'user_id' }],
  })
  shared_users: User[];
}
