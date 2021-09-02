import { Module } from '@nestjs/common';
import { RequestInjectable } from 'src/injectables/request.injectable';

@Module({ providers: [RequestInjectable], exports: [RequestInjectable] })
export class AuditingModule {}
