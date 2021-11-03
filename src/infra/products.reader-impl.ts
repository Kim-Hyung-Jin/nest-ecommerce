import { ProductsReader } from '../domain/products.reader';
import { Products } from '../domain/entity/product.entity';
import { ProductsOptionGroupInfo } from '../domain/dto/products.info';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import ProductOption from '../domain/entity/product-option.entity';

@Injectable()
export class ProductsReaderImpl implements ProductsReader {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  async getByProductCode(productCode: string): Promise<Products> {
    const product = await this.productRepository.findOne({
      relations: [
        'productOptionGroupList',
        'productOptionGroupList.productOptionList',
      ],
      where: [{ productCode: productCode }],
    });

    if (!product) {
      throw new EntityNotFoundError(Products, productCode);
    }
    return product;
  }

  getProductOptionGroupInfoList(product: Products): ProductsOptionGroupInfo[] {
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
