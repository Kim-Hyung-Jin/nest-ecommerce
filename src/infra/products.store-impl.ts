import ProductsStore from '../domain/products.store';
import { ProductsPersist } from '../domain/entity/persist/product.persist-entity';
import { Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../domain/entity/product.entity';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import ProductOptionGroupPersist from '../domain/entity/persist/product-option-group.persist-entity';
import ProductOptionPersist from '../domain/entity/persist/product-option.persist-entity';
import { CreateProductCommand } from '../domain/dto/create-product.command';

@Injectable()
export class ProductsStoreImpl implements ProductsStore {
  constructor(
    @InjectRepository(ProductsPersist)
    private readonly productRepository: Repository<ProductsPersist>,
  ) {}

  async store(command: CreateProductCommand): Promise<Products> {
    const initPersistProducts = new ProductsPersist(
      command.productName,
      command.productPrice,
      command.productOptionGroupList.map(value => {
        return new ProductOptionGroupPersist(
          value.productOptionGroupName,
          value.ordering,
          value.productOptionList.map(value1 => {
            return new ProductOptionPersist(
              value1.productOptionName,
              value1.ordering,
              value1.productOptionPrice,
            );
          }),
        );
      }),
    );
    const persistProducts = await this.productRepository.save(
      initPersistProducts,
    );
    return new Products(persistProducts);
  }
}
