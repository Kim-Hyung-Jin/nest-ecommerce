import { Products } from '../src/domain/entity/product.entity';
import ProductOptionGroup from '../src/domain/entity/product-option-group.entity';
import ProductOption from '../src/domain/entity/product-option.entity';
import * as faker from 'faker';

export function fixtureProduct() {
  const productOptionGroupList = [];
  for (let i = 0; i < randomNumberWithRange(0, 5); i++) {
    productOptionGroupList.push(fixtureProductOptionGroup());
  }
  return new Products(
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
  return new ProductOptionGroup(
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
  return new ProductOption(
    faker.commerce.productName(),
    faker.datatype.number(),
    faker.commerce.price(),
  );
}
