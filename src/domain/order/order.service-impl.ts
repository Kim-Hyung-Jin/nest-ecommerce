import * as OrderInfo from '../dto/order/order.info';
import * as OrderCommand from '../dto/order/order.command';
import * as OrderResult from '../dto/order/order.result';
import OrderService from './order.service';
import OrderStore from './order.store';
import { Inject, Injectable } from '@nestjs/common';
import OrderCommandMapper from './order-command.mapper';
import OrderReader from './order.reader';
import { OrderPersist } from '../entity/order/persist/order.persist';

@Injectable()
export default class OrderServiceImpl implements OrderService {
  constructor(
    @Inject('OrderStore') private orderStore: OrderStore,
    @Inject('OrderReader') private orderReader: OrderReader,
    private orderCommandMapper: OrderCommandMapper,
  ) {}

  async create(command: OrderCommand.CreateOrder): Promise<OrderInfo.Simple> {
    const initEntity = this.orderCommandMapper.toEntity(command);
    const order = await this.orderStore.store(initEntity);
    return { ...order };
  }

  async get(orderCode: string): Promise<OrderInfo.Simple> {
    const order = await this.orderReader.getOrder(orderCode);
    return { ...order };
  }

  async cancel(orderCode: string): Promise<OrderInfo.Simple> {
    const retrievedOrder = await this.orderReader.getOrder(orderCode);
    retrievedOrder.orderLineList.map(orderLine => orderLine.onCancel());
    const canceledOrder = await this.orderStore.store(retrievedOrder);
    return { ...canceledOrder };
  }

  async partCancel(
    orderCode: string,
    cancelOrderLineIdList: number[],
  ): Promise<OrderInfo.Simple> {
    const retrievedOrder = await this.orderReader.getOrder(orderCode);
    cancelOrderLineIdList.map(cancelOrderLineId =>
      this.getCancelOrderLine(retrievedOrder, cancelOrderLineId).onCancel(),
    );
    const canceledOrder = await this.orderStore.store(retrievedOrder);
    return { ...canceledOrder };
  }

  private getCancelOrderLine(order: OrderPersist, cancelOrderLineId: number) {
    return order.orderLineList.find(
      orderLine => orderLine.id == cancelOrderLineId,
    );
  }
}
