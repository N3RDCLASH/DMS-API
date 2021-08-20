import { ApiProperty } from '@nestjs/swagger';
import { AuditingBase } from 'src/auditingbase/auditingbase.interface';
import { User } from 'src/users/models/user.entity';
import { Timestamp } from 'typeorm';

export interface Document extends AuditingBase {
  file: string;
  owner_id: number;
  shared_users?: User[];
}
