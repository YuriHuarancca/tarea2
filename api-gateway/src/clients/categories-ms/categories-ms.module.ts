import { Module } from '@nestjs/common';
import { CategoriesMsController } from './categories-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig } from '../../config/env.validation';

@Module({
  controllers: [CategoriesMsController],
  imports: [
    ClientsModule.register([
        {
        name: 'CATEGORIES-MS-CLIENT',//podemos ponerle el nombre que queramos, es el nombre con el que vamos a inyectar el cliente en el controlador
        transport: Transport.TCP,
        options: {
                host:envConfig.CATEGORIES_MS_HOST,
                port:envConfig.CATEGORIES_MS_PORT
            },
        }
    ])
 ],
})
export class CategoriesMsModule {}
