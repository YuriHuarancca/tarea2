import { Module } from '@nestjs/common';
import { ProductsMsController } from './products-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig } from '../../config/env.validation';

@Module({
  controllers: [ProductsMsController],
  imports: [
    ClientsModule.register([
        {
        name: 'PRODUCTS-MS-CLIENT',//podemos ponerle el nombre que queramos, es el nombre con el que vamos a inyectar el cliente en el controlador
        transport: Transport.TCP,
        options: {
                host:envConfig.PRODUCTS_MS_HOST,
                port:envConfig.PRODUCTS_MS_PORT

            },
        }
    ])
 ],
})
export class ProductsMsModule {}
