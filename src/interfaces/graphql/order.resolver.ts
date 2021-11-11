import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UpdateProductResponse } from '../dto/product/update-product.response';
import * as OrderDto from '../dto/order/order-dto';
import * as OrderCommand from '../../domain/dto/order.command';
import OrderFacade from '../../application/order.facade';
import * as OrderResponse from '../dto/order/order-response';

@Resolver('Order')
export class OrderResolver {
  constructor(private orderFacade: OrderFacade) {}

  @Mutation()
  async createOrder(
    @Args('data') dto: OrderDto.CreateOrder,
  ): Promise<OrderResponse.CreateOrder> {
    const command: OrderCommand.CreateOrder = { ...dto };
    const result = await this.orderFacade.createOrder(command);
    return { ...result.orderInfo };
  }
}
