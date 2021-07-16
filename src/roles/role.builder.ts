export class RoleBuilder {
  private readonly _role;
  constructor() {
    this._role = {
      name: '',
    };
  }
  setName(name: string) {
    this._role.name = name;
    return this;
  }
  build() {
    return this._role;
  }
}
