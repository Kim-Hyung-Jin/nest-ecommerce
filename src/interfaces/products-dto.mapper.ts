import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from '../domain/dto/create-product.command';
import { ProductsResult } from '../domain/products.result';
import { Injectable } from '@nestjs/common';
import { CreateProductResponse } from './dto/create-product.response';
import { CreateProductDto, CreateProductOptionDto, CreateProductOptionGroupDto } from './dto/create-product.dto';

@Injectable()
export class ProductsDtoMapper {
  toCreateProductCommand(dto: CreateProductDto): CreateProductCommand {
    return {
      productName: dto.productName,
      productPrice: dto.productPrice,
      productOptionGroupList: dto.productOptionGroupList.map(
        productOptionGroup =>
          this.toCreateProductOptionGroupCommand(productOptionGroup),
      ),
    };
  }

  toCreateProductOptionGroupCommand(
    dto: CreateProductOptionGroupDto,
  ): CreateProductOptionGroupCommand {
    return {
      productOptionGroupName: dto.productOptionGroupName,
      ordering: dto.ordering,
      productOptionList: dto.productOptionList.map(productOption =>
        this.toCreateProductOptionCommand(productOption),
      ),
    };
  }

  toCreateProductOptionCommand(
    dto: CreateProductOptionDto,
  ): CreateProductOptionCommand {
    return {
      productOptionName: dto.productOptionName,
      ordering: dto.ordering,
      productOptionPrice: dto.productOptionPrice,
    };
  }

  ofResponse(result: ProductsResult): CreateProductResponse {
    return {
      productCode: result.productInfo.productCode,
    };
  }
}
