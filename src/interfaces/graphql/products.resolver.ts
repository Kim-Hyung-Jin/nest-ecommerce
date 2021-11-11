import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ProductsService } from '../../domain/products.service';
import { ProductsInfo } from '../../domain/dto/products.info';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductsDtoMapper } from '../products-dto.mapper';
import ProductsFacade from '../../application/products.facade';

@Resolver('Products')
export class ProductsResolver {
  constructor(
    private productsFacade: ProductsFacade,
    private productsDtoMapper: ProductsDtoMapper,
  ) {}

  @Query()
  async getProduct(
    @Args('productCode', { type: () => String }) productCode: string,
  ) {
    return this.productsFacade.getOne(productCode);
  }

  @Mutation()
  async registerProduct(@Args('data') dto: CreateProductDto) {
    const command = this.productsDtoMapper.toCreateProductCommand(dto);
    return this.productsFacade.register(command);
  }
}
