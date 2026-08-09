import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [CustomersModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
