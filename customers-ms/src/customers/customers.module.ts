import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CustomersService],
  controllers: [CustomersController],
  imports: [PrismaModule] //
})
export class CustomersModule {}
