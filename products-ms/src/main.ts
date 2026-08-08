				
		import { NestFactory } from '@nestjs/core';
		import { AppModule } from './app.module';
		import { Logger, ValidationPipe } from '@nestjs/common';
		import { envConfig } from './config/env.validation';
		import { Transport } from '@nestjs/microservices';


		async function bootstrap() {
		  const app = await NestFactory.createMicroservice(AppModule, {
			tranport: Transport.TCP,
			options: {
			  host: envConfig.HOST,
			  port: envConfig.PORT,
			},
		  });

		  app.useGlobalPipes(
			new ValidationPipe({
			  whitelist: true, //elimina propiedades que no esten en el DTO 
			  forbidNonWhitelisted: true, //lanza un error si hay propiedades que no esten en el DTO
			  transform: true, //transforma los tipos de datos a los que se esperan en el DTO
			})
		  );

		  await app.listen();

		  Logger.log(`Porducts-MS corriendo en http://${envConfig.HOST}:${envConfig.PORT}`, 'main');
		}
		bootstrap();
