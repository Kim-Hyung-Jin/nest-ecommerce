import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Product } from '../../domain/entity/product/product.entity';
import ProductOptionGroup from '../../domain/entity/product/product-option-group.entity';
import ProductOption from '../../domain/entity/product/product-option.entity';
import { Injectable } from '@nestjs/common';
import { LoggerService } from '../../common/logger-services';
import { Order } from '../../domain/entity/order/order.entity';
import { OrderAddress } from '../../domain/entity/order/order.address.entity';
import { OrderLine } from '../../domain/entity/order/order-line.entity';
import { OrderProductOptionGroup } from '../../domain/entity/order/order-product-option-group.entity';
import { OrderProductOption } from '../../domain/entity/order/order-product-option.entity';

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
        Order,
        OrderAddress,
        OrderLine,
        OrderProductOptionGroup,
        OrderProductOption,
      ],
      synchronize: true,
      logging: ['query', 'error'],
      logger: this.logger,
      keepConnectionAlive: true,
    };
  }
}
