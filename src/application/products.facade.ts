import { Inject, Injectable } from '@nestjs/common';
import { CreateProductCommand } from '../domain/dto/create-product.command';
import { ProductsServiceImpl } from '../domain/products.service-impl';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { ProductsResult } from '../domain/products.result';
import { ProductsService } from '../domain/products.service';

@Injectable()
export default class ProductsFacade {
  constructor(
    private productsCommandMapper: ProductsCommandMapper,
    @Inject('ProductsService') private productsService: ProductsService,
  ) {}

  async registerProduct(
    command: CreateProductCommand,
  ): Promise<ProductsResult> {
    const productInfo = await this.productsService.create(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async getProduct(productCode: string): Promise<ProductsResult> {
    const productInfo = await this.productsService.findOne(productCode);
    return this.productsCommandMapper.ofResult(productInfo);
  }
}
