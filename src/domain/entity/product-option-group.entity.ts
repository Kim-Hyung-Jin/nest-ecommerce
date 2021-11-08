import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOption from './product-option.entity';
import { ProductsPersist } from './persist/product.persist-entity';
import { Products } from './product.entity';
import ProductOptionGroupPersist from './persist/product-option-group.persist-entity';

export default class ProductOptionGroup {
  private persist: ProductOptionGroupPersist;

  get id(): number {
    return this.persist.id;
  }

  get productOptionGroupName(): string {
    return this.persist.productOptionGroupName;
  }

  //TODO 왜 setter를 열어야되지
  get productOptionList(): ProductOption[] {
    return this.persist.productOptionList.map(value => {
      return new ProductOption(value);
    });
  }

  // set productOptionList(productOptionList: ProductOption[]) {
  //   this.persist.productOptionList = productOptionList;
  // }

  get ordering(): number {
    return this.persist.ordering;
  }

  constructor(persist: ProductOptionGroupPersist) {
    this.persist = persist;
  }
}
