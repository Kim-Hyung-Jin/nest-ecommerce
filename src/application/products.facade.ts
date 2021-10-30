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

  async register(command: CreateProductCommand): Promise<ProductsResult> {
    const productInfo = await this.productsService.register(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async getOne(productCode: string): Promise<ProductsResult> {
    const productInfo = await this.productsService.getOne(productCode);
    return this.productsCommandMapper.ofResult(productInfo);
  }
}
