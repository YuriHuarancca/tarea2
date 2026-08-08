import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { envConfig } from '../config/env.validation';


@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy // estos interfaces permiten que el servicio se conecte y desconecte de la base de datos al iniciar y apagar el servicio respectivamente
{
	constructor() {
		const adapter = new PrismaPg(envConfig.DATABASE_URL);
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