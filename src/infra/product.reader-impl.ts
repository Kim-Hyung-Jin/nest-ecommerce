import { ProductReader } from '../domain/product.reader';
import { Product } from '../domain/entity/product.entity';
import { ProductOptionGroupInfo } from '../domain/dto/product.info';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import { ProductCommandMapper } from '../domain/product.command.mapper';
import ProductOption from '../domain/entity/product-option.entity';

@Injectable()
export class ProductReaderImpl implements ProductReader {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productCommandMapper: ProductCommandMapper,
  ) {}

  async getProductBy(productCode: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      relations: [
        'productOptionGroupList',
        'productOptionGroupList.productOptionList',
      ],
      where: [{ productCode: productCode }],
    });

    if (!product) {
      throw new EntityNotFoundError(Product, productCode);
    }
    return product;
  }

  getAllOptionInfoList(product: Product): ProductOptionGroupInfo[] {
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
  ): ProductOptionGroupInfo {
    return {
      id: productOptionGroup.id,
      productOptionGroupName: productOptionGroup.productOptionGroupName,
      ordering: productOptionGroup.ordering,
      productOptionList: productOptionGroup.productOptionList.map(
        productOption =>
          this.productCommandMapper.ofPaymentOptionInfo(productOption),
      ),
    };
  }
}
