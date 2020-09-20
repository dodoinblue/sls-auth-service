import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  await nestApp.init();
  return expressApp;
}

const app = bootstrap().then(expressApp => {
  console.log('Nest express app created');
  return expressApp;
});

console.log('export nest express app');
export default app;
