import { Product } from '../products/entities/product.entity';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from '../products/dto/create-product.command';
import ProductOption from '../products/entities/product-option.entity';
import ProductOptionGroup from '../products/entities/product-option-group.entity';
import { ProductsInfo } from './products.info';
import { ProductsResult } from './products.result';

export class ProductsCommandMapper {
  toProductEntity(command: CreateProductCommand): Product {
    const product = new Product();
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
