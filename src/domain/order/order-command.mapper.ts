import * as OrderCommand from '../dto/order/order.command';
import { OrderAddress } from '../entity/order/order.address.entity';
import { Order } from '../entity/order/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderLine } from '../entity/order/order-line.entity';
import { OrderProductOptionGroup } from '../entity/order/order-product-option-group.entity';
import { OrderProductOption } from '../entity/order/order-product-option.entity';

@Injectable()
export default class OrderCommandMapper {
  toEntity(command: OrderCommand.CreateOrder): Order {
    const orderAddress = new OrderAddress(
      command.address.receiverName,
      command.address.receiverPhone,
      command.address.receiverZipcode,
      command.address.receiverAddress1,
      command.address.receiverAddress2,
    );

    const orderLineList = command.orderLineList.map(orderLine => {
      return new OrderLine(
        orderLine.ordering,
        orderLine.productCode,
        orderLine.orderCount,
        orderLine.productPrice,
        orderLine.productOptionGroupList.map(optionGroup => {
          return new OrderProductOptionGroup(
            optionGroup.productOptionGroupName,
            optionGroup.ordering,
            optionGroup.productionOptionList.map(option => {
              return new OrderProductOption(
                option.productOptionPrice,
                option.productOptionName,
                option.ordering,
              );
            }),
          );
        }),
      );
    });

    return new Order(
      command.userId,
      command.payMethod,
      orderAddress,
      orderLineList,
    );
  }
}
