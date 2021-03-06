import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../domain/entity/product/product.entity';
import ProductOptionGroup from '../domain/entity/product/product-option-group.entity';
import ProductOption from '../domain/entity/product/product-option.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'lodash';
import { takeUntil } from 'rxjs';
import { TypeOrmService } from '../config/typeorm';
import { LoggerService } from '../common/logger-services';
import { GraphQLService } from '../config/graphql';
import { LoggerMiddleware } from '../common/logger.middleware';
import ProductController from '../interfaces/product.controller';
import { OrderModule } from './order.module';

@Module({
  imports: [
    ProductModule,
    OrderModule,
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
    consumer.apply(LoggerMiddleware).forRoutes(ProductController);
  }
}
