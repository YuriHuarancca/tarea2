
		import { NestFactory } from '@nestjs/core';
		import { AppModule } from './app.module';
		import { Logger, ValidationPipe } from '@nestjs/common';
		import { envConfig } from './config/env.validation';

		async function bootstrap() {
		  const app = await NestFactory.create(AppModule);

		  app.useGlobalPipes(
			new ValidationPipe({
			  whitelist: true, //elimina propiedades que no esten en el DTO 
			  forbidNonWhitelisted: true, //lanza un error si hay propiedades que no esten en el DTO
			  transform: true, //transforma los tipos de datos a los que se esperan en el DTO
		   })
		  );
		  await app.listen(envConfig.PORT, envConfig.HOST);

		  Logger.log(`API Gateway ejecutandose en http://${envConfig.HOST}:${envConfig.PORT}`, 'main');
		}
		bootstrap();
