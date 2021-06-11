import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welkom bij de Qualogy DMS API';
  }
}
