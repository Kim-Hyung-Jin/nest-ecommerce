import * as OrderCommand from '../dto/order/order.command';
import { OrderAddressPersist } from '../entity/order/persist/order.address.persist';
import { OrderPersist } from '../entity/order/persist/order.persist';
import { Injectable } from '@nestjs/common';
import { OrderLinePersist } from '../entity/order/persist/order-line.entity';
import { OrderProductOptionGroupPersist } from '../entity/order/persist/order-product-option-group.persist';
import { OrderProductOptionPersist } from '../entity/order/persist/order-product-option.persist';

@Injectable()
export default class OrderCommandMapper {
  toEntity(command: OrderCommand.CreateOrder): OrderPersist {
    const orderAddress = new OrderAddressPersist(
      command.address.receiverName,
      command.address.receiverPhone,
      command.address.receiverZipcode,
      command.address.receiverAddress1,
      command.address.receiverAddress2,
    );

    const orderLineList = command.orderLineList.map(orderLine => {
      return new OrderLinePersist(
        orderLine.ordering,
        orderLine.productCode,
        orderLine.orderCount,
        orderLine.productPrice,
        orderLine.productOptionGroupList.map(optionGroup => {
          return new OrderProductOptionGroupPersist(
            optionGroup.productOptionGroupName,
            optionGroup.ordering,
            optionGroup.productionOptionList.map(option => {
              return new OrderProductOptionPersist(
                option.productOptionPrice,
                option.productOptionName,
                option.ordering,
              );
            }),
          );
        }),
      );
    });

    return new OrderPersist(
      command.userId,
      command.payMethod,
      orderAddress,
      orderLineList,
    );
  }
}
