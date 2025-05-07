import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source'; // Ton instance de DataSource

AppDataSource.initialize()
  .then(() => {
    console.log('Connection établie avec succès !');
  })
  .catch((err) => {
    console.error('Connexion échoué !', err);
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
