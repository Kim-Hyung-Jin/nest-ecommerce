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

@Resolver('Products')
export class ProductsResolver {
  constructor(
    @Inject('ProductsService') private productsService: ProductsService,
    private productsDtoMapper: ProductsDtoMapper,
  ) {}

  @Query()
  async getProduct(
    @Args('productCode', { type: () => String }) productCode: string,
  ) {
    return this.productsService.getOne(productCode);
  }

  @Mutation()
  async registerProduct(@Args('data') dto: CreateProductDto) {
    // TODO http request랑 같은거 써도 되나
    const command = this.productsDtoMapper.toCreateProductCommand(dto);
    return this.productsService.register(command);
  }
}
