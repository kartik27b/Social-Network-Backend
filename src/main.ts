import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useWebSocketAdapter(new WsAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  await app.listen(3000);
}
bootstrap();
