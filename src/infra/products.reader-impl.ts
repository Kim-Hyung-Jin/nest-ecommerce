import { ProductsReader } from '../domain/products.reader';
import { ProductsPersist } from '../domain/entity/persist/product.persist-entity';
import { ProductsOptionGroupInfo } from '../domain/dto/products.info';
import { Entity, EntityNotFoundError, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ProductOptionGroupPersist from '../domain/entity/persist/product-option-group.persist-entity';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import ProductOptionPersist from '../domain/entity/persist/product-option.persist-entity';
import { Products } from '../domain/entity/product.entity';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductsReaderImpl implements ProductsReader {
  constructor(
    @InjectRepository(ProductsPersist)
    private readonly productRepository: Repository<ProductsPersist>,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  async getByProductCode(productCode: string): Promise<Products> {
    const persistProduct = await this.productRepository.findOne({
      relations: [
        'productOptionGroupList',
        'productOptionGroupList.productOptionList',
      ],
      where: [{ productCode: productCode }],
    });

    if (!persistProduct) {
      throw new EntityNotFoundError(ProductsPersist, productCode);
    }

    return new Products(persistProduct);
  }

  getAllOptionInfoList(product: Products): ProductsOptionGroupInfo[] {
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
