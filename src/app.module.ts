import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './domain/entity/product.entity';
import ProductOptionGroup from './domain/entity/product-option-group.entity';
import ProductOption from './domain/entity/product-option.entity';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'lodash';
import { ProductsResolver } from './interfaces/graphql/products.resolver';
import { takeUntil } from 'rxjs';

@Module({
  imports: [
    ProductsModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: true,
      debug: true,
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jin',
      database: 'test',
      entities: [Products, ProductOptionGroup, ProductOption],
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
