import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderAddress } from '../domain/entity/order/order.address.entity';
import { OrderLine } from '../domain/entity/order/order-line.entity';
import OrderFacade from '../application/order.facade';
import { Order } from '../domain/entity/order/order.entity';
import { OrderProductOptionGroup } from '../domain/entity/order/order-product-option-group.entity';
import OrderServiceImpl from '../domain/order/order.service-impl';
import OrderCommandMapper from '../domain/order/order-command.mapper';
import { OrderResolver } from '../interfaces/graphql/order.resolver';
import { OrderProductOption } from '../domain/entity/order/order-product-option.entity';
import { OrderStoreImpl } from '../infra/order.store-impl';
import { OrderReaderImpl } from '../infra/order.reader-impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderAddress,
      OrderLine,
      OrderProductOptionGroup,
      OrderProductOption,
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
