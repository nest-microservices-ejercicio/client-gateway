import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import 'dotenv/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {

  const logger = new Logger('main')
  logger.log('conecatdo al gateway 🧡')

  const app = await NestFactory.create(AppModule);

  console.log('primer commit')
  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // NestJS elimina campos que no están en el DTO
      forbidNonWhitelisted: true, // Retorna un error si viene un campo que no está en el DTO
    })
  )

  //- Creamos una instancia del exceptionFilter - capturador de errores que pueden venir del microservicio
  app.useGlobalFilters(new RpcCustomExceptionFilter())


  await app.listen(envs.port ?? 3000);

}
bootstrap();
