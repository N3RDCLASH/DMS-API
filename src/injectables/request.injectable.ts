import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/users/models/user.entity';

@Injectable()
export class RequestInjectable {
  private _request: Request;
  private _user: any;

  constructor() {}

  public setRequest(request: Request) {
    this._request = request;
  }
  public getRequest(): Request {
    return this._request;
  }
  public setUser(user: any) {
    this._user = user;
  }
  public getUser(): User {
    return this._user;
  }
}
