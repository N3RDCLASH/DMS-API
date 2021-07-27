import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/service/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/models/user.dto';
import { Observable, from } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJWT(user: CreateUserDto): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
  comparePasswords(newPassword: string, passwortHash: string): Observable<any> {
    return from(bcrypt.compare(newPassword, passwortHash));
  }

  generateJWTExpireDate() {
    const expiryDate = new Date();
    expiryDate.setSeconds(
      expiryDate.getSeconds() + parseInt(process.env.EXPIRES_IN.split('s')[0]),
    );
    return expiryDate;
  }
}
