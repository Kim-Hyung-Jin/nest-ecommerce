import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ProductsPersist } from '../../domain/entity/persist/product.persist-entity';
import ProductOptionGroupPersist from '../../domain/entity/persist/product-option-group.persist-entity';
import ProductOptionPersist from '../../domain/entity/persist/product-option.persist-entity';
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
      entities: [ProductsPersist, ProductOptionGroupPersist, ProductOptionPersist],
      synchronize: true,
      logging: ['query', 'error'],
      logger: this.logger,
    };
  }
}
