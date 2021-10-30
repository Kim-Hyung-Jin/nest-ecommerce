import { ProductsReader } from '../domain/products.reader';
import ProductsStore from '../domain/products.store';
import { Product } from '../domain/entity/product.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsStoreImpl implements ProductsStore {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async store(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }
}
