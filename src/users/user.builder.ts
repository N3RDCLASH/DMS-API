import { User } from './user.interface';

export class UserBuilder {
  private readonly _user: User;
  constructor() {
    this._user = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
    };
  }

  setFirstName(firstname: string): UserBuilder {
    this._user.firstname = firstname;
    return this;
  }
  setLastName(lastname: string): UserBuilder {
    this._user.lastname = lastname;
    return this;
  }
  setUserName(username: string): UserBuilder {
    this._user.username = username;
    return this;
  }
  setEmail(email: string): UserBuilder {
    this._user.email = email;
    return this;
  }
  setPassword(password: string): UserBuilder {
    this._user.password = password;
    return this;
  }
  build(): User {
    return this._user;
  }
}
