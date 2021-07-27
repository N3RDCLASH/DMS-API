import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Permission as PermissionEntity } from 'src/permissions/models/permission.entity';
import { DeleteResult, getRepository, Repository, UpdateResult } from 'typeorm';
import { Role as RoleEntity } from '../models/role.entity';
import { CreateRoleDto } from '../models/role.dto';

const roleRelations = { relations: ['permissions'] };
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  createRole(role: CreateRoleDto): Observable<RoleEntity> {
    return from(this.roleRepository.save(role));
  }

  findAllRoles(): Observable<RoleEntity[]> {
    return from(this.roleRepository.find({ ...roleRelations }));
  }
  findOneRole(id: number): Promise<RoleEntity> {
    return this.roleRepository.findOne(id, { ...roleRelations });
  }

  updateOneRole(id: number, role: CreateRoleDto): Observable<UpdateResult> {
    return from(this.roleRepository.update(id, role));
  }
  deleteOneRole(id: number): Observable<DeleteResult> {
    return from(this.roleRepository.delete(id));
  }

  addPermissiontoRole(role: RoleEntity, permission: PermissionEntity) {
    role.permissions = [permission];
    return from(this.roleRepository.save(role));
  }
  removePermissionfromRole( 
    role: RoleEntity,
    permissionToRemove: PermissionEntity,
  ) {
    role.permissions = role.permissions.filter((permission) => {
      permission.id !== permissionToRemove.id;
    });
    return from(this.roleRepository.save(role));
  }
}
