import { Module } from '@nestjs/common';
import { CustomersMsController } from './customers-ms.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envConfig } from '../../config/env.validation';

@Module({
  controllers: [CustomersMsController],
  imports: [
    ClientsModule.register([
        {
        name: 'CUSTOMERS-MS-CLIENT',//podemos ponerle el nombre que queramos, es el nombre con el que vamos a inyectar el cliente en el controlador
        transport: Transport.TCP,
        options: {
                host:envConfig.CUSTOMERS_MS_HOST,
                port:envConfig.CUSTOMERS_MS_PORT
            },
        }
    ])
 ],
})
export class CustomersMsModule {}
