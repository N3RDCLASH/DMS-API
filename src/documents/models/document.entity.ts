import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';

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
}
