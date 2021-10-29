import { Injectable } from '@nestjs/common';
import { CreateProductCommand } from '../products/dto/create-product.command';
import { ProductsService } from '../products/products.service';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { ProductsResult } from '../domain/products.result';

@Injectable()
export default class ProductsFacade {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  registerProduct(command: CreateProductCommand): ProductsResult {
    const productInfo = this.productsService.create(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }
}
