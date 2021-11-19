import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from '../domain/dto/product/product.command';
import { ProductResult } from '../domain/dto/product/product.result';
import { Injectable } from '@nestjs/common';
import { ProductResponse } from './dto/product.response';
import { CreateProductDto, CreateProductOptionDto, CreateProductOptionGroupDto } from './dto/product.dto';

@Injectable()
export class ProductDtoMapper {
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

  ofResponse(result: ProductResult): ProductResponse {
    return {
      productCode: result.productInfo.productCode,
    };
  }
}
