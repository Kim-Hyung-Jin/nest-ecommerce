import * as OrderCommand from '../domain/dto/order.command';
import * as OrderResult from '../domain/dto/order.result';
import OrderService from '../domain/order.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class OrderFacade {
  constructor(@Inject('ProductService') private orderService: OrderService) {}

  async create(command: OrderCommand.CreateOrder): Promise<OrderResult.Simple> {
    const info = await this.orderService.create(command);
    return { orderInfo: info };
  }

  async get(orderCode: string): Promise<OrderResult.Simple> {
    const info = await this.orderService.get(orderCode);
    return { orderInfo: info };
  }

  async cancel(orderCode: string): Promise<OrderResult.Simple> {
    const info = await this.orderService.cancel(orderCode);
    return { orderInfo: info };
  }

  async partCancel(
    orderCode: string,
    cancelOrderLineIdList: number[],
  ): Promise<OrderResult.Simple> {
    const info = await this.orderService.partCancel(
      orderCode,
      cancelOrderLineIdList,
    );
    return { orderInfo: info };
  }
}
