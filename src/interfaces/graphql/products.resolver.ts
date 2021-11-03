import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ProductsService } from '../../domain/products.service';
import { ProductsInfo } from '../../domain/dto/products.info';

@Resolver('Products')
export class ProductsResolver {
  constructor(
    @Inject('ProductsService') private productsService: ProductsService,
  ) {}

  @Query()
  async getProduct(
    @Args('productCode', { type: () => String }) productCode: string,
  ) {
    return this.productsService.findOne(productCode);
  }
}
