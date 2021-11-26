import { Module } from '@nestjs/common';
import { OrderReaderImpl } from '../infra/Order.reader-impl';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAddressPersist } from '../domain/entity/order/persist/order.address.persist';
import { OrderLinePersist } from '../domain/entity/order/persist/order-line.entity';
import OrderFacade from '../application/order.facade';
import { OrderPersist } from '../domain/entity/order/persist/order.persist';
import { OrderProductOptionGroupPersist } from '../domain/entity/order/persist/order-product-option-group.persist';
import OrderServiceImpl from '../domain/order/order.service-impl';
import OrderCommandMapper from '../domain/order/order-command.mapper';
import { OrderResolver } from '../interfaces/graphql/order.resolver';
import { OrderProductOptionPersist } from '../domain/entity/order/persist/order-product-option.persist';
import { OrderStoreImpl } from '../infra/order.store-impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderPersist,
      OrderAddressPersist,
      OrderLinePersist,
      OrderProductOptionGroupPersist,
      OrderProductOptionPersist,
    ]),
  ],
  providers: [
    OrderFacade,
    {
      provide: 'OrderService',
      useClass: OrderServiceImpl,
    },
    {
      provide: 'OrderReader',
      useClass: OrderReaderImpl,
    },
    {
      provide: 'OrderStore',
      useClass: OrderStoreImpl,
    },
    OrderCommandMapper,
    OrderResolver,
  ],
})
export class OrderModule {}
