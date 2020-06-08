import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  const { origin, port: serverPort } = config.get('server');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors({ origin });
    logger.log(`Accepting requests from origin "${origin}"`);
  }

  const port = process.env.PORT || serverPort;

  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
}
bootstrap();
