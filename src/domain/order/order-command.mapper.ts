import * as OrderCommand from '../dto/order/order.command';
import { OrderAddress } from '../entity/order/order.address.entity';
import { Order } from '../entity/order/order.entity';
import { Injectable } from '@nestjs/common';
import { OrderLine } from '../entity/order/order-line.entity';
import { OrderProductOptionGroup } from '../entity/order/order-product-option-group.entity';
import { OrderProductOption } from '../entity/order/order-product-option.entity';
import * as OrderInfo from '../dto/order/order.info';

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

  of(entity: Order): OrderInfo.Simple {
    return {
      orderCode: entity.orderCode,
      userId: entity.userId,
      payMethod: entity.payMethod,
      address: {
        receiverName: entity.address.receiverName,
        receiverPhone: entity.address.receiverPhone,
        receiverZipcode: entity.address.receiverZipcode,
        receiverAddress1: entity.address.receiverAddress1,
        receiverAddress2: entity.address.receiverAddress2,
      },
      orderLineList: entity.orderLineList.map(orderLine => {
        return {
          ordering: orderLine.ordering,
          productCode: orderLine.productCode,
          orderCount: orderLine.orderCount,
          productPrice: orderLine.productPrice,
          status: orderLine.status,
          productOptionGroupList: orderLine.productOptionGroupList.map(
            productOptionGroup => {
              return {
                productOptionGroupName:
                  productOptionGroup.productOptionGroupName,
                ordering: productOptionGroup.ordering,
                productionOptionList:
                  productOptionGroup.productionOptionList.map(productOption => {
                    return {
                      productOptionPrice: productOption.productOptionPrice,
                      productOptionName: productOption.productOptionName,
                      ordering: productOption.ordering,
                    };
                  }),
              };
            },
          ),
        };
      }),
    };
  }
}
