import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { Permission as PermissionEntity } from '../models/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  //  Permissions are readonly in the system
  
  findAllPermissions(): Observable<PermissionEntity[]> {
    return from(this.permissionRepository.find());
  }
  findOnePermission(id: number): Observable<PermissionEntity> {
    return from(this.permissionRepository.findOne(id));
  }
}
