import { Product } from '../entity/product/product.entity';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from '../dto/product/product.command';
import ProductOption from '../entity/product/product-option.entity';
import ProductOptionGroup from '../entity/product/product-option-group.entity';
import {
  ProductInfo,
  ProductOptionGroupInfo,
  ProductOptionInfo,
} from '../dto/product/product.info';
import { ProductResult } from '../dto/product/product.result';
import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class ProductCommandMapper {
  toProductEntity(command: CreateProductCommand): Product {
    return new Product(
      command.productName,
      command.productPrice,
      command.productOptionGroupList.map(productOptionGroupCommand =>
        this.toProductOptionGroupEntity(productOptionGroupCommand),
      ),
    );
  }

  toProductOptionGroupEntity(
    command: CreateProductOptionGroupCommand,
  ): ProductOptionGroup {
    return new ProductOptionGroup(
      command.productOptionGroupName,
      command.ordering,
      command.productOptionList.map(productOptionCommand =>
        this.toProductOptionEntity(productOptionCommand),
      ),
    );
  }

  toProductOptionEntity(command: CreateProductOptionCommand): ProductOption {
    return new ProductOption(
      command.productOptionName,
      command.ordering,
      command.productOptionPrice,
    );
  }

  ofPaymentInfo(
    entity: Product,
    productOptionGroupInfoList: ProductOptionGroupInfo[],
  ): ProductInfo {
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
    productOptionList: ProductOptionInfo[],
  ): ProductOptionGroupInfo {
    return {
      id: productOptionGroup.id,
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionList,
    };
  }

  ofPaymentOptionInfo(productOption: ProductOption): ProductOptionInfo {
    return {
      id: productOption.id,
      productOptionName: productOption.productOptionName,
      productOptionPrice: productOption.productOptionPrice,
      ordering: productOption.ordering,
    };
  }

  ofResult(productInfo: ProductInfo): ProductResult {
    return {
      productInfo: productInfo,
    };
  }
}
