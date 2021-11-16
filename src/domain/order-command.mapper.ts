import * as OrderCommand from './dto/order.command';
import { OrderAddress } from './entity/order-address';
import { Order } from './entity/order.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class OrderCommandMapper {
  toEntity(command: OrderCommand.CreateOrder): Order {
    const orderAddress = new OrderAddress(
      command.receiverName,
      command.receiverPhone,
      command.receiverZipcode,
      command.receiverAddress1,
      command.receiverAddress2,
    );

    return new Order(command.userId, command.payMethod, orderAddress);
  }
}
