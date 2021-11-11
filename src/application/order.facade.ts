import * as OrderCommand from '../domain/dto/order.command';
import * as OrderResult from '../domain/dto/order.result';
import OrderService from '../domain/order.service';

export default class OrderFacade {
  constructor(private orderService: OrderService) {}

  async create(
    command: OrderCommand.CreateOrder,
  ): Promise<OrderResult.Simple> {
    return await this.orderService.create(command);
  }
}
