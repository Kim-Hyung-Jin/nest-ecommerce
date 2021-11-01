import { ProductsReader } from '../domain/products.reader';
import { Product } from '../domain/entity/product.entity';
import { ProductsOptionGroupInfo } from '../domain/dto/products.info';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import ProductOption from '../domain/entity/product-option.entity';

@Injectable()
export class ProductsReaderImpl implements ProductsReader {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  async getProductByCode(productCode: string): Promise<Product> {
    return await this.productRepository.findOne({
      relations: [
        'productOptionGroupList',
        'productOptionGroupList.productOptionList',
      ],
      where: [{ productCode: productCode }],
    });
  }

  getProductOptionGroupInfoList(product: Product): ProductsOptionGroupInfo[] {
    Logger.log(
      'getProductOptionGroupInfoList -> ' +
        JSON.stringify(product.productOptionGroupList, null, 2),
    );
    return product.productOptionGroupList.map(productOptionGroup =>
      this.getProductOptionInfo(productOptionGroup),
    );
  }

  getProductOptionInfo(
    productOptionGroup: ProductOptionGroup,
  ): ProductsOptionGroupInfo {
    const a = {
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionGroup.productOptionList.map(
        productOption =>
          this.productsCommandMapper.ofPaymentOptionInfo(productOption),
      ),
    };
    Logger.log('getProductOptionInfo -> ' + a);
    return {
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionGroup.productOptionList.map(
        productOption =>
          this.productsCommandMapper.ofPaymentOptionInfo(productOption),
      ),
    };
  }
}
