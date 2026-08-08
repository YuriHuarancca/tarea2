import { Module, Options } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  providers: [ProductsService],
  controllers: [ProductsController],
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'CATEGORIES_MS_CLIENT',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002
        }
      }
    ])
  ]
})
export class ProductsModule { }