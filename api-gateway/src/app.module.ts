import { Module } from '@nestjs/common';
import { ProductsMsModule } from './clients/products-ms/products-ms.module';
import { CategoriesMsModule } from './clients/categories-ms/categories-ms.module';

@Module({
    imports: [ProductsMsModule, CategoriesMsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
