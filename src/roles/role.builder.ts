import { Role } from './models/role.interface';

export class RoleBuilder {
  private readonly _role: Role;
  constructor() {
    this._role = {
      name: '',
    };
  }
  setName(name: string): RoleBuilder {
    this._role.name = name;
    return this;
  }
  build(): Role {
    return this._role;
  }
}
