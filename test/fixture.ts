import { ProductsPersist } from '../src/domain/entity/persist/product.persist-entity';
import ProductOptionGroupPersist from '../src/domain/entity/persist/product-option-group.persist-entity';
import ProductOptionPersist from '../src/domain/entity/persist/product-option.persist-entity';
import * as faker from 'faker';

export function fixtureProduct() {
  const productOptionGroupList = [];
  for (let i = 0; i < randomNumberWithRange(0, 5); i++) {
    productOptionGroupList.push(fixtureProductOptionGroup());
  }
  return new ProductsPersist(
    faker.commerce.productName(),
    faker.datatype.number(),
    productOptionGroupList,
  );
}

export function fixtureProductOptionGroup() {
  const productOptionList = [];
  for (let i = 0; i < randomNumberWithRange(0, 5); i++) {
    productOptionList.push(fixtureProductOption());
  }
  return new ProductOptionGroupPersist(
    faker.commerce.productName(),
    faker.datatype.number(),
    productOptionList,
  );
}

function randomNumberWithRange(min = 0, max: number) {
  const randomNum = Math.random() * (max + 1);
  return Math.floor(randomNum + min);
}

export function fixtureProductOption() {
  return new ProductOptionPersist(
    faker.commerce.productName(),
    faker.datatype.number(),
    faker.commerce.price(),
  );
}
