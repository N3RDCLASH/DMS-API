import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/models/user.entity';
import { Timestamp } from 'typeorm';

export interface Document {
  file: string;
  owner_id: number;
  created_at?: Timestamp;

  updated_at?: Timestamp;

  deleted_at?: Timestamp;

  shared_users?: User[];
}
