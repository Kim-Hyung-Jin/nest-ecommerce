import { Products } from './entity/product.entity';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from './dto/create-product.command';
import ProductOption from './entity/product-option.entity';
import ProductOptionGroup from './entity/product-option-group.entity';
import {
  ProductsInfo,
  ProductsOptionGroupInfo,
  ProductsOptionInfo,
} from './dto/products.info';
import { ProductsResult } from './products.result';
import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class ProductsCommandMapper {
  toProductEntity(command: CreateProductCommand): Products {
    const product = new Products();
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

  ofPaymentInfo(
    entity: Products,
    productOptionGroupInfoList: ProductsOptionGroupInfo[],
  ): ProductsInfo {
    Logger.log('## -> ' + productOptionGroupInfoList);
    return {
      productName: entity.productName,
      productPrice: entity.productPrice,
      productCode: entity.productCode,
      status: entity.status,
      productOptionGroupList: productOptionGroupInfoList,
    };
  }

  ofPaymentOptionGroupInfo(
    productOptionGroup: ProductOptionGroup,
    productOptionList: ProductsOptionInfo[],
  ): ProductsOptionGroupInfo {
    return {
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionList,
    };
  }

  ofPaymentOptionInfo(productOption: ProductOption): ProductsOptionInfo {
    return {
      productOptionName: productOption.productOptionName,
      productOptionPrice: productOption.productOptionPrice,
      ordering: productOption.ordering,
    };
  }

  ofResult(productsInfo: ProductsInfo): ProductsResult {
    return {
      productInfo: productsInfo,
    };
  }
}
