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
    return new Products(
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
      id: productOptionGroup.id,
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionList,
    };
  }

  ofPaymentOptionInfo(productOption: ProductOption): ProductsOptionInfo {
    return {
      id: productOption.id,
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
