import { ProductsPersist } from './entity/persist/product.persist-entity';
import {
  CreateProductCommand,
  CreateProductOptionCommand,
  CreateProductOptionGroupCommand,
} from './dto/create-product.command';
import ProductOptionPersist from './entity/persist/product-option.persist-entity';
import ProductOptionGroupPersist from './entity/persist/product-option-group.persist-entity';
import {
  ProductsInfo,
  ProductsOptionGroupInfo,
  ProductsOptionInfo,
} from './dto/products.info';
import { ProductsResult } from './products.result';
import { Injectable, Logger } from '@nestjs/common';
import { LoggerService } from '@nestjs/common';
import { Products } from './entity/product.entity';
import ProductOptionGroup from './entity/product-option-group.entity';
import ProductOption from './entity/product-option.entity';

@Injectable()
export class ProductsCommandMapper {
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
    productOptionGroup: ProductOptionGroupPersist,
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
