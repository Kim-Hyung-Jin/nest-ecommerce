import { Products } from '../src/domain/entity/product.entity';
import ProductOptionGroup from '../src/domain/entity/product-option-group.entity';
import ProductOption from '../src/domain/entity/product-option.entity';
import * as faker from 'faker';

export function fixtureProduct() {
  const product = new Products();
  product.productName = faker.commerce.productName();
  product.productPrice = faker.datatype.number();
  product.productOptionGroupList = [];
  for (let i = 0; i < randomNumberWithRange(0, 5); i++) {
    product.productOptionGroupList.push(fixtureProductOptionGroup());
  }
  return product;
}

export function fixtureProductOptionGroup() {
  const productOptionGroup = new ProductOptionGroup();
  productOptionGroup.id = faker.datatype.number();
  productOptionGroup.productOptionGroupName = faker.commerce.productName();
  productOptionGroup.ordering = faker.datatype.number();
  productOptionGroup.productOptionList = [];
  for (let i = 0; i < randomNumberWithRange(0, 5); i++) {
    productOptionGroup.productOptionList.push(fixtureProductOption());
  }
  return productOptionGroup;
}

function randomNumberWithRange(min = 0, max: number) {
  const randomNum = Math.random() * (max + 1);
  return Math.floor(randomNum + min);
}

export function fixtureProductOption() {
  const productOption = new ProductOption();
  productOption.productOptionName = faker.commerce.productName();
  productOption.productOptionGroup = faker.commerce.productName();
  productOption.productOptionPrice = faker.commerce.price();
  productOption.ordering = faker.datatype.number();
  return productOption;
}
