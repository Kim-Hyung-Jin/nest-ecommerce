import { Inject, Injectable } from '@nestjs/common';
import { CreateProductCommand } from '../domain/dto/create-product.command';
import { ProductsServiceImpl } from '../domain/products.service-impl';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { ProductsResult } from '../domain/products.result';
import { ProductsService } from '../domain/products.service';

@Injectable()
export default class ProductsFacade {
  constructor(
    @Inject('ProductsService')
    private readonly productsService: ProductsService,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  async registerProduct(
    command: CreateProductCommand,
  ): Promise<ProductsResult> {
    const productInfo = await this.productsService.create(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }
}
