import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'permissions', synchronize: false })
export class Permission {
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
}