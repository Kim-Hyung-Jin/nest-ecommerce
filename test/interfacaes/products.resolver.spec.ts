import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductsResolver } from '../../src/interfaces/graphql/products.resolver';
import { ProductsDtoMapper } from '../../src/interfaces/products-dto.mapper';
import { fixtureInfo } from '../fixture';
import ProductsFacade from '../../src/application/products.facade';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';

const mockFacade = {
  register: jest.fn(),
  getOne: jest.fn(),
  updateProduct: jest.fn(),
  updateProductOptionGroup: jest.fn(),
  updateProductOption: jest.fn(),
};

async function getTestModule() {
  return await Test.createTestingModule({
    providers: [
      { provide: ProductsFacade, useValue: mockFacade },
      ProductsResolver,
      ProductsDtoMapper,
    ],
  }).compile();
}

describe('products Query 호출시', () => {
  let resolver: ProductsResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  describe('올바른 productCode 가 주어졌으면', () => {
    it('조회한 상품 정보 응답', async () => {
      const productCode = faker.datatype.uuid();
      const mockedInfo = fixtureInfo('준비중', productCode);

      mockFacade.getOne.mockReturnValue(mockedInfo);

      const res = await resolver.getProduct(productCode);
      expect(res).toStrictEqual(mockedInfo);
    });
  });
});

describe('Mutation Products 호출시', () => {
  let resolver: ProductsResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductsResolver>(ProductsResolver);
  });
  describe('올바른 dto 가 주어졌다면', () => {
    it('등록된 products 응답', async () => {
      const request = makeRequest();
      const mockedInfo = fixtureInfo('준비중');
      const expectedCommand = {
        productName: request.productName,
        productPrice: request.productPrice,
        productOptionGroupList: request.productOptionGroupList,
      };
      mockFacade.register.mockReturnValue(mockedInfo);
      const res = await resolver.registerProduct(request);
      expect(mockFacade.register).toHaveBeenCalledWith(expectedCommand);
      expect(res).toStrictEqual(mockedInfo);
    });
  });
});

function makeRequest() {
  return {
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
    productCode: faker.datatype.uuid(),
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
