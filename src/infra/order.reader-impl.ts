import { ProductReader } from '../domain/product/product.reader';
import { Product } from '../domain/entity/product/product.entity';
import { ProductOptionGroupInfo } from '../domain/dto/product/product.info';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductOptionGroup from '../domain/entity/product/product-option-group.entity';
import { ProductCommandMapper } from '../domain/product/product.command.mapper';
import ProductOption from '../domain/entity/product/product-option.entity';
import OrderReader from '../domain/order/order.reader';
import { Order } from '../domain/entity/order/order.entity';

@Injectable()
export class OrderReaderImpl implements OrderReader {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async getOrder(orderCode: string): Promise<Order> {
    const order = await this.orderRepository.findOne(
      { orderCode: orderCode },
      {
        relations: [
          'address',
          'orderLineList',
          'orderLineList.productOptionGroupList',
          'orderLineList.productOptionGroupList.productionOptionList',
        ],
      },
    );
    if (!order) {
      throw new EntityNotFoundError(Order, orderCode);
    }
    return order;
  }
}
