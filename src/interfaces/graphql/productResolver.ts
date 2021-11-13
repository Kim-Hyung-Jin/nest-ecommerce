import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ProductService } from '../../domain/product.service';
import { ProductInfo } from '../../domain/dto/product.info';
import { CreateProductDto } from '../dto/product/create-product.dto';
import { ProductDtoMapper } from '../product-dto.mapper';
import ProductFacade from '../../application/product.facade';
import { UpdateProductDto, UpdateProductOptionDto, UpdateProductOptionGroupDto } from '../dto/product/update-product.dto';
import { UpdateProductResponse } from '../dto/product/update-product.response';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../../domain/dto/update-product.command';

@Resolver('Product')
export class ProductResolver {
  constructor(
    private productFacade: ProductFacade,
    private productDtoMapper: ProductDtoMapper,
  ) {}

  @Query()
  async getProduct(
    @Args('productCode', { type: () => String }) productCode: string,
  ) {
    return this.productFacade.getOne(productCode);
  }

  @Mutation()
  async registerProduct(@Args('data') dto: CreateProductDto) {
    const command = this.productDtoMapper.toCreateProductCommand(dto);
    return this.productFacade.register(command);
  }

  @Mutation()
  async updateProduct(
    @Args('data') dto: UpdateProductDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductCommand = { ...dto };
    const result = await this.productFacade.updateProduct(command);
    return { ...result.productInfo };
  }

  @Mutation()
  async updateProductOptionGroup(
    @Args('data') dto: UpdateProductOptionGroupDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductOptionGroupCommand = { ...dto };
    const result = await this.productFacade.updateProductOptionGroup(command);
    return { ...result.productInfo };
  }

  @Mutation()
  async updateProductOption(
    @Args('data') dto: UpdateProductOptionDto,
  ): Promise<UpdateProductResponse> {
    const command: UpdateProductOptionCommand = { ...dto };
    const result = await this.productFacade.updateProductOption(command);
    return { ...result.productInfo };
  }
}
