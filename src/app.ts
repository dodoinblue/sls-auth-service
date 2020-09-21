import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function createApp() {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  nestApp.setGlobalPrefix('/auth/api/v1');

  const options = new DocumentBuilder()
    .setTitle('Star Super Auth API')
    .setDescription('Serverless auth API')
    .setVersion('0.1')
    .addTag('Auth')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(nestApp, options);
  SwaggerModule.setup('api', nestApp, document);

  nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await nestApp.init();
  return { expressApp, nestApp };
}

const app = createApp().then(({ expressApp }) => {
  console.log('Nest express app created');
  return expressApp;
});

console.log('export nest express app');
export default app;
