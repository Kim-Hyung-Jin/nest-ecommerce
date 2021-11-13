import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductResolver } from '../../src/interfaces/graphql/productResolver';
import { ProductDtoMapper } from '../../src/interfaces/product-dto.mapper';
import { fixtureInfo } from '../fixture';
import ProductFacade from '../../src/application/product.facade';
import { ProductCommandMapper } from '../../src/domain/product.command.mapper';
import { IsNumber } from 'class-validator';

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
      { provide: ProductFacade, useValue: mockFacade },
      ProductResolver,
      ProductDtoMapper,
    ],
  }).compile();
}

describe('getProduct Query 호출시', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductResolver>(ProductResolver);
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

describe('registerProduct Mutation 호출시', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductResolver>(ProductResolver);
  });
  describe('올바른 dto 가 주어졌다면', () => {
    it('등록된 product 응답', async () => {
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

describe('updateProduct Mutation 호출시', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductResolver>(ProductResolver);
  });
  describe('올바른 dto 가 주어졌다면', () => {
    it('등록된 product 응답', async () => {
      const request = makeUpdateProductRequest();
      const mockedInfo = fixtureInfo('준비중');
      const mockedResult = { productInfo: { ...mockedInfo } };
      const expectedCommand = { ...request };
      const expectedResult = { productInfo: { ...mockedInfo } };
      const expectedResponse = { ...expectedResult.productInfo };

      mockFacade.updateProduct.mockReturnValue(mockedResult);

      const res = await resolver.updateProduct(request);
      expect(mockFacade.updateProduct).toHaveBeenCalledWith(expectedCommand);
      expect(res).toStrictEqual(expectedResponse);
    });
  });
});

describe('updateProductOptionGroup Mutation 호출시', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductResolver>(ProductResolver);
  });
  describe('올바른 dto 가 주어졌다면', () => {
    it('등록된 product 응답', async () => {
      const request = makeUpdateProductOptionGroupRequest();
      const mockedInfo = fixtureInfo('준비중');
      const mockedResult = { productInfo: { ...mockedInfo } };
      const expectedCommand = { ...request };
      const expectedResult = { productInfo: { ...mockedInfo } };
      const expectedResponse = { ...expectedResult.productInfo };

      mockFacade.updateProductOptionGroup.mockReturnValue(mockedResult);

      const res = await resolver.updateProductOptionGroup(request);
      expect(mockFacade.updateProductOptionGroup).toHaveBeenCalledWith(expectedCommand);
      expect(res).toStrictEqual(expectedResponse);
    });
  });
});

describe('updateProductOption Mutation 호출시', () => {
  let resolver: ProductResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<ProductResolver>(ProductResolver);
  });
  describe('올바른 dto 가 주어졌다면', () => {
    it('등록된 product 응답', async () => {
      const request = makeUpdateProductOptionRequest();
      const mockedInfo = fixtureInfo('준비중');
      const mockedResult = { productInfo: { ...mockedInfo } };
      const expectedCommand = { ...request };
      const expectedResult = { productInfo: { ...mockedInfo } };
      const expectedResponse = { ...expectedResult.productInfo };

      mockFacade.updateProductOption.mockReturnValue(mockedResult);

      const res = await resolver.updateProductOption(request);
      expect(mockFacade.updateProductOption).toHaveBeenCalledWith(
        expectedCommand,
      );
      expect(res).toStrictEqual(expectedResponse);
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

function makeUpdateProductRequest() {
  return {
    productCode: faker.datatype.uuid(),
    productName: faker.commerce.productName(),
    productPrice: faker.commerce.price(),
  };
}

function makeUpdateProductOptionGroupRequest() {
  return {
    id: faker.datatype.number(),
    productCode: faker.datatype.uuid(),
    productOptionGroupName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
  };
}

function makeUpdateProductOptionRequest() {
  return {
    productCode: faker.datatype.uuid(),
    optionGroupId: faker.datatype.number(),
    id: faker.datatype.number(),
    productOptionName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
    productOptionPrice: faker.commerce.price(),
  };
}
