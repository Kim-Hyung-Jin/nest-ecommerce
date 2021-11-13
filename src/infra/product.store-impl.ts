import ProductStore from '../domain/product.store';
import { Product } from '../domain/entity/product.entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductStoreImpl implements ProductStore {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async store(product: Product): Promise<Product> {
    Logger.log('save! ' + JSON.stringify(product, null, 2));
    return await this.productRepository.save(product);
  }
}
