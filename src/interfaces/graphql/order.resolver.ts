import { Args, Mutation, Resolver } from '@nestjs/graphql';
import * as OrderDto from '../dto/order-dto';
import * as OrderCommand from '../../domain/dto/order/order.command';
import OrderFacade from '../../application/order.facade';
import * as OrderResponse from '../dto/order-response';

@Resolver('Order')
export class OrderResolver {
  constructor(private orderFacade: OrderFacade) {}

  @Mutation()
  async create(
    @Args('data') dto: OrderDto.CreateOrder,
  ): Promise<OrderResponse.CreateOrder> {
    const command: OrderCommand.CreateOrder = { ...dto };
    const result = await this.orderFacade.create(command);
    return { ...result.orderInfo };
  }
}
