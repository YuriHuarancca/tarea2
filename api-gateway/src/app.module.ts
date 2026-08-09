import { Module } from '@nestjs/common';
import { ProductsMsModule } from './clients/products-ms/products-ms.module';
import { CategoriesMsModule } from './clients/categories-ms/categories-ms.module';
import { CustomersMsModule } from './clients/customers-ms/customers-ms.module';

@Module({
    imports: [ProductsMsModule, CategoriesMsModule, CustomersMsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
