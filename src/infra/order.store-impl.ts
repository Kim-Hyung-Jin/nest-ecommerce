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
import OrderStore from '../domain/order/order.store';

@Injectable()
export class OrderStoreImpl implements OrderStore {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async store(order: Order): Promise<Order> {
    return await this.orderRepository.save(order);
  }
}
