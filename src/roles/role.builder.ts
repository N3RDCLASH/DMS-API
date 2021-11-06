import { CreateRoleDto } from './models/role.dto';

export class RoleBuilder {
  private readonly _role: CreateRoleDto;
  constructor() {
    this._role = {
      name: '',
    };
  }
  
  setName(name: string): RoleBuilder {
    this._role.name = name;
    return this;
  }

  build(): CreateRoleDto {
    return this._role;
  }
}
