import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Product } from '../../domain/entity/product.entity';
import ProductOptionGroup from '../../domain/entity/product-option-group.entity';
import ProductOption from '../../domain/entity/product-option.entity';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/logger-services';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  private logger = new LoggerService(TypeOrmService.name);

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jin',
      database: 'test',
      entities: [Product, ProductOptionGroup, ProductOption],
      synchronize: true,
      logging: ['query', 'error'],
      logger: this.logger,
    };
  }
}
