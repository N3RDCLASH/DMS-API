import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/user.interface';
import { Observable, from } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePasswords(newPassword: string, passwortHash: string): Observable<any> {
    return from(bcrypt.compare(newPassword, passwortHash));
  }
}
