import { CreateProductDto, CreateProductOptionDto, CreateProductOptionGroupDto } from './create-product.dto';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand
} from './create-product.command';

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
}
