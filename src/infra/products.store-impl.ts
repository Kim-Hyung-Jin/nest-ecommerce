import { ProductsReader } from '../domain/products.reader';
import ProductsStore from '../domain/products.store';
import { Products } from '../domain/entity/product.entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsStoreImpl implements ProductsStore {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}

  async store(product: Products): Promise<Products> {
    Logger.log('save! ' + JSON.stringify(product, null, 2));
    return await this.productRepository.save(product);
  }
}
