import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
