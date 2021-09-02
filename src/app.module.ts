import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { RolesController } from './roles/controllers/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuditingSubscriber } from './auditingbase/auditing.subscriber';
import { RequestInjectable } from './injectables/request.injectable';
import { AuditingModule } from './auditingbase/auditing.module';

@Module({
  imports: [
    UsersModule,
    DocumentsModule,
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    RolesModule,
    PermissionsModule,
    AuditingModule,
  ],
  controllers: [AppController, RolesController],
  providers: [AppService, AuditingSubscriber],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
