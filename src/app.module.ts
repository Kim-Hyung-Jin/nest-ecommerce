import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/entity/product.entity';
import ProductOptionGroup from './domain/entity/product-option-group.entity';
import ProductOption from './domain/entity/product-option.entity';
import { LoggerMiddleware } from './logger.middleware';
import ProductsController from './interfaces/products.controller';

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
      logging: ['query', 'error'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes(ProductsController);
//   }
// }
