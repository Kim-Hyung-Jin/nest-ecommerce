import ProductsStore from '../domain/products.store';
import { ProductsPersist } from '../domain/entity/persist/product.persist-entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsStoreImpl implements ProductsStore {
  constructor(
    @InjectRepository(ProductsPersist)
    private readonly productRepository: Repository<ProductsPersist>,
  ) {}

  async store(product: ProductsPersist): Promise<ProductsPersist> {
    Logger.log('save! ' + JSON.stringify(product, null, 2));
    return await this.productRepository.save(product);
  }
}
