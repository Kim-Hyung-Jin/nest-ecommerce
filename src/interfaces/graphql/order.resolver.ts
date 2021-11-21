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
    @Args('dto') dto: OrderDto.CreateOrder,
  ): Promise<OrderResponse.CreateOrder> {
    const command: OrderCommand.CreateOrder = { ...dto };
    const result = await this.orderFacade.create(command);
    return { ...result.orderInfo };
  }

  @Mutation()
  async cancel(
    @Args('dto') dto: OrderDto.CancelOrder,
  ): Promise<OrderResponse.CreateOrder> {
    const command: OrderCommand.CancelOrder = { ...dto };
    const result = await this.orderFacade.cancel(command.orderCode);
    return { ...result.orderInfo };
  }

  @Mutation()
  async partCancel(
    @Args('dto') dto: OrderDto.PartCancelOrder,
  ): Promise<OrderResponse.CreateOrder> {
    const command: OrderCommand.PartCancelOrder = { ...dto };
    const result = await this.orderFacade.partCancel(
      command.orderCode,
      command.orderLineIdList,
    );
    return { ...result.orderInfo };
  }
}
