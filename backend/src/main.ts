import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

async function bootstrap() {
  /*
  const httpsOptions = {
    key: fs.readFileSync('/folder/your.key'),
    cert: fs.readFileSync('/folder/your.crt'),
  };
  */
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe());
  const configService = new ConfigService();

  const logger = new Logger('Bootstrap');

  if (configService.get('DEVELOPMENT') !== '1') {
    logger.debug('prod');
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
  } else {
    logger.debug('dev');
    app.enableCors({
      origin: '*',
      credentials: true,
    });
  }

  await app.listen(configService.get('BACKEND_PORT'));
}
bootstrap();
