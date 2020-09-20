import { NestFactory } from '@nestjs/core';
import { createApp } from './app';

async function bootstrap() {
  const { nestApp: app } = await createApp();

  await app.listen(3000);
}
bootstrap();
