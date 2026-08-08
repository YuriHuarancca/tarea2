import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { envConfig } from '../config/env.validation';
import { PrismaMariaDb } from '@prisma/adapter-mariadb'


@Injectable()
export class PrismaService 
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy // estos interfaces permiten que el servicio se conecte y desconecte de la base de datos al iniciar y apagar el servicio respectivamente
	{
        constructor() {
            const adapter = new PrismaMariaDb(envConfig.DATABASE_URL);// sirve para conectar la base de datos de XAMPP con Prisma, usando la URL de conexión definida en las variables de entorno
            super({ adapter });
        }

				async onModuleInit() {
					//Esto conecta la base de datos de XAMPP al iniciar
					await this.$connect();
				}

				async onModuleDestroy() {
					//Esto desconecta la base de datos limpiamente al apagar el servicio
					await this.$disconnect();
				}

		}