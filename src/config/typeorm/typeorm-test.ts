import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Product } from '../../domain/entity/product/product.entity';
import ProductOptionGroup from '../../domain/entity/product/product-option-group.entity';
import ProductOption from '../../domain/entity/product/product-option.entity';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/logger-services';
import { OrderPersist } from '../../domain/entity/order/persist/order.persist';
import { OrderAddressPersist } from '../../domain/entity/order/persist/order.address.persist';
import { OrderLinePersist } from '../../domain/entity/order/persist/order-line.entity';
import { OrderProductOptionGroupPersist } from '../../domain/entity/order/persist/order-product-option-group.persist';
import { OrderProductOptionPersist } from '../../domain/entity/order/persist/order-product-option.persist';

@Injectable()
export class TypeormTestService implements TypeOrmOptionsFactory {
  private logger = new LoggerService(TypeormTestService.name);

  createTypeOrmOptions(): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return {
      type: 'sqlite' as any,
      database: ':memory:',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'jin',
      entities: [
        Product,
        ProductOptionGroup,
        ProductOption,
        OrderPersist,
        OrderAddressPersist,
        OrderLinePersist,
        OrderProductOptionGroupPersist,
        OrderProductOptionPersist,
      ],
      synchronize: true,
      logging: ['query', 'error'],
      logger: this.logger,
      keepConnectionAlive: true,
    };
  }
}
