import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entity/product.entity';
import ProductOptionGroup from './domain/entity/product-option-group.entity';
import ProductOption from './domain/entity/product-option.entity';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jin',
      database: 'test',
      entities: [Product, ProductOptionGroup, ProductOption],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
