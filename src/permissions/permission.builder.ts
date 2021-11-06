import { Permission } from './models/permission.interface';

export class PermissionBuilder {
  private readonly _permission: Permission;
  constructor() {
    this._permission = {
      name: '',
    };
  }

  setName(name: string): PermissionBuilder {
    this._permission.name = name;
    return this;
  }
  
  builder(): Permission {
    return this._permission;
  }
}
