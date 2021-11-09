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

export function fixtureCreateCommand() {
  return {
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: faker.datatype.uuid(),
    productOptionGroupList: [
      {
        productOptionGroupName: faker.commerce.productName(),
        ordering: 1,
        productOptionList: [
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 3,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
      {
        productOptionGroupName: faker.commerce.productName(),
        ordering: 2,
        productOptionList: [
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
    ],
  };
}

// TODO nullable
export function fixtureUpdateCommand() {
  return {
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: faker.datatype.uuid(),
  };
}

export function fixtureInfo(productCode = faker.datatype.uuid()) {
  return {
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: productCode,
    status: '준비중',
    productOptionGroupList: [
      {
        productOptionGroupName: faker.commerce.productName(),
        ordering: 1,
        productOptionList: [
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 3,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
      {
        productOptionGroupName: faker.commerce.productName(),
        ordering: 2,
        productOptionList: [
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
    ],
  };
}
