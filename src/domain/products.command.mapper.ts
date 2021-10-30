import { Product } from './entity/product.entity';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from './dto/create-product.command';
import ProductOption from './entity/product-option.entity';
import ProductOptionGroup from './entity/product-option-group.entity';
import { ProductsInfo } from './dto/products.info';
import { ProductsResult } from './products.result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductsCommandMapper {
  toProductEntity(command: CreateProductCommand): Product {
    const product = new Product();
    product.productPrice = command.productPrice;
    product.productName = command.productName;
    product.productOptionGroupList = command.productOptionGroupList.map(
      productOptionGroupCommand =>
        this.toProductOptionGroupEntity(productOptionGroupCommand),
    );
    return product;
  }

  toProductOptionGroupEntity(
    command: CreateProductOptionGroupCommand,
  ): ProductOptionGroup {
    const productOptionGroup = new ProductOptionGroup();
    productOptionGroup.productOptionGroupName = command.productOptionGroupName;
    productOptionGroup.ordering = command.ordering;
    productOptionGroup.productOptionList = command.productOptionList.map(
      productOptionCommand => this.toProductOptionEntity(productOptionCommand),
    );
    return productOptionGroup;
  }

  toProductOptionEntity(command: CreateProductOptionCommand): ProductOption {
    const productOption = new ProductOption();
    productOption.productOptionName = command.productOptionName;
    productOption.productOptionPrice = command.productOptionPrice;
    productOption.ordering = command.ordering;
    return productOption;
  }

  ofInfo(entity: Product): ProductsInfo {
    return {
      productName: entity.productName,
      productPrice: entity.productPrice,
      productCode: entity.productCode,
      status: entity.status,
      productOptionGroupList: entity.productOptionGroupList,
    };
  }

  ofResult(productsInfo: ProductsInfo): ProductsResult {
    return {
      productInfo: productsInfo,
    };
  }
}
