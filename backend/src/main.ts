import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());
  const configService = new ConfigService();

  app.enableCors({
    allowedHeaders: '*',
    origin: (origin, callback) => {
      const allowedOrigin = configService.get('FRONTEND_URL');
      if (!allowedOrigin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
  await app.listen(configService.get('BACKEND_PORT'));
}
bootstrap();
