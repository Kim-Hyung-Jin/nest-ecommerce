import { Module } from '@nestjs/common';
import { ProductsServiceImpl } from './domain/products.service-impl';
import ProductsController from './interfaces/products.controller';
import ProductsFacade from './application/products.facade';
import { ProductsStoreImpl } from './infra/products.store-impl';
import { ProductsReaderImpl } from './infra/products.reader-impl';
import { ProductsDtoMapper } from './interfaces/products-dto.mapper';
import { ProductsCommandMapper } from './domain/products.command.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    ProductsFacade,
    {
      provide: 'ProductsService',
      useClass: ProductsServiceImpl,
    },
    {
      provide: 'ProductsStore',
      useClass: ProductsStoreImpl,
    },
    {
      provide: 'ProductsReader',
      useClass: ProductsReaderImpl,
    },
    ProductsDtoMapper,
    ProductsCommandMapper,
  ],
})
export class ProductsModule {}
