import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../domain/entity/product.entity';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import ProductOption from '../domain/entity/product-option.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'lodash';
import { ProductsResolver } from '../interfaces/graphql/products.resolver';
import { takeUntil } from 'rxjs';
import { TypeOrmService } from '../config/typeorm';
import { LoggerService } from '../common/logger-services';
import { GraphQLService } from '../config/graphql';
import { LoggerMiddleware } from '../common/logger.middleware';
import ProductsController from '../interfaces/products.controller';

@Module({
  imports: [
    ProductsModule,
    GraphQLModule.forRootAsync({
      useClass: GraphQLService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmService,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ProductsController);
  }
}
