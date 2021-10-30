import { ProductsReader } from '../domain/products.reader';
import { Product } from '../domain/entity/product.entity';
import { ProductsOptionGroupInfo } from '../domain/dto/products.info';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsReaderImpl implements ProductsReader {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductByCode(productCode: string): Promise<Product> {
    return this.productRepository.findOneOrFail({
      where: [{ productCode: productCode }],
    });
  }

  async getProductOptionGroupInfoList(
    product: Product,
  ): Promise<ProductsOptionGroupInfo> {
    return undefined;
  }
}
