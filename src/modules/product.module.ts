import { Module } from '@nestjs/common';
import { ProductServiceImpl } from '../domain/product.service-impl';
import ProductController from '../interfaces/product.controller';
import ProductFacade from '../application/product.facade';
import { ProductStoreImpl } from '../infra/product.store-impl';
import { ProductReaderImpl } from '../infra/product.reader-impl';
import { ProductDtoMapper } from '../interfaces/product-dto.mapper';
import { ProductCommandMapper } from '../domain/product.command.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../domain/entity/product.entity';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import { ProductResolver } from '../interfaces/graphql/productResolver';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductOptionGroup])],
  controllers: [ProductController],
  providers: [
    ProductFacade,
    {
      provide: 'ProductService',
      useClass: ProductServiceImpl,
    },
    {
      provide: 'ProductStore',
      useClass: ProductStoreImpl,
    },
    {
      provide: 'ProductReader',
      useClass: ProductReaderImpl,
    },
    ProductDtoMapper,
    ProductCommandMapper,
    ProductResolver,
  ],
})
export class ProductModule {}
