import * as OrderCommand from '../domain/dto/order.command';
import * as OrderResult from '../domain/dto/order.result';
import OrderService from '../domain/order.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export default class OrderFacade {
  constructor(@Inject('ProductsService') private orderService: OrderService) {}

  async create(command: OrderCommand.CreateOrder): Promise<OrderResult.Simple> {
    const info = await this.orderService.create(command);
    return { orderInfo: info };
  }
}
