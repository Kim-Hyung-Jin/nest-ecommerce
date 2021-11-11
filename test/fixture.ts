import { Products } from '../src/domain/entity/product.entity';
import ProductOptionGroup from '../src/domain/entity/product-option-group.entity';
import ProductOption from '../src/domain/entity/product-option.entity';
import * as faker from 'faker';

export function fixtureProduct() {
  const productOptionGroupList = [];
  for (let i = 0; i < randomNumberWithRange(1, 5); i++) {
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
  for (let i = 0; i < randomNumberWithRange(1, 5); i++) {
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
export function fixtureUpdateProductCommand(
  productCode = faker.datatype.uuid(),
) {
  return {
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: productCode,
  };
}

export function fixture<T>(obj: T) {
  // console.log(T.);
  const temp = {};
  console.log('@@!! -> ' + JSON.stringify(obj));
  if (typeof obj === 'object') {
    Object.keys(obj).map(k => {
      if (typeof k === 'string') {
        temp['k'] = faker.datatype.string();
      } else if (typeof k === 'number') {
        temp['k'] = faker.datatype.number();
      } else if (typeof k === 'boolean') {
        temp['k'] = faker.datatype.boolean();
      }
    });
  }
  console.log('@@!! -> ' + JSON.stringify(temp));
}

export function fixtureUpdateProductOptionGroupCommand() {
  return {
    productCode: faker.datatype.uuid(),
    id: faker.datatype.number(),
    productOptionGroupName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
  };
}

export function fixtureUpdateProductOptionCommand() {
  return {
    optionGroupId: faker.datatype.number(),
    productCode: faker.datatype.uuid(),
    id: faker.datatype.number(),
    productOptionName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
    productOptionPrice: faker.datatype.number(),
  };
}

export function fixtureInfo(
  status: string,
  productCode = faker.datatype.uuid(),
) {
  return {
    id: faker.datatype.number(),
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: productCode,
    status: status,
    productOptionGroupList: [
      {
        id: faker.datatype.number(),
        productOptionGroupName: faker.commerce.productName(),
        ordering: 1,
        productOptionList: [
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 3,
          },
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
      {
        id: faker.datatype.number(),
        productOptionGroupName: faker.commerce.productName(),
        ordering: 2,
        productOptionList: [
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      },
    ],
  };
}
