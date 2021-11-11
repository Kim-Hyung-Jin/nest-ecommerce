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
import { CreateProductDto } from '../dto/product/create-product.dto';
import { ProductsDtoMapper } from '../products-dto.mapper';
import ProductsFacade from '../../application/products.facade';
import { UpdateProductDto, UpdateProductOptionDto, UpdateProductOptionGroupDto } from '../dto/product/update-product.dto';
import { UpdateProductResponse } from '../dto/product/update-product.response';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../../domain/dto/update-product.command';

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

  @Mutation()
  async updateProduct(
    @Args('data') dto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductCommand = { ...dto };
    const result = await this.productsFacade.updateProduct(command);
    return { ...result.productInfo };
  }

  @Mutation()
  async updateProductOptionGroup(
    @Args('data') dto: UpdateProductOptionGroupDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductOptionGroupCommand = { ...dto };
    const result = await this.productsFacade.updateProductOptionGroup(command);
    return { ...result.productInfo };
  }

  @Mutation()
  async updateProductOption(
    @Args('data') dto: UpdateProductOptionDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductOptionCommand = { ...dto };
    const result = await this.productsFacade.updateProductOption(command);
    return { ...result.productInfo };
  }
}
