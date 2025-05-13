import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin:[ 'http://localhost:3000',  'http://192.168.157.73:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',  
    allowedHeaders: 'Content-Type, Accept, Authorization', 
    credentials: true, 
  });
  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
