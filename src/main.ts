import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import * as expressListRoutes from 'express-list-routes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable cors for API
  app.enableCors();

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('DMS API Documentation')
    .setDescription('The DMS API description')
    .setVersion('1.0')
    .addTag('dms')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  // Mechanism for seeing requestst made to the server
  // const server = app.getHttpServer();
  // const router = server._events.request._router;
  // console.log(expressListRoutes({}, 'API:', router));
}
bootstrap();
