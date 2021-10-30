import { Test, TestingModule } from '@nestjs/testing';
import ProductsController from './products.controller';
import ProductsFacade from '../application/products.facade';
import * as faker from 'faker';
import { ProductsDtoMapper } from './products-dto.mapper';
import { ProductsResult } from '../domain/products.result';
import { Logger } from '@nestjs/common';

const mockFacade = {
  registerProduct: jest.fn(),
  getProduct: jest.fn(),
};
jest.mock('../application/products.facade');

describe('ProductsController', () => {
  let controller: ProductsController;
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductsFacade,
          useValue: mockFacade,
        },
        ProductsDtoMapper,
      ],
      controllers: [ProductsController],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    facade = module.get<ProductsFacade>(ProductsFacade);
    Logger.log('### -> ' + facade);
  });

  describe('상품 조회 요청시', () => {
    const mockedResult = {
      productInfo: {
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
      },
    };

    const expectedProductionOptionGroupList = [];
    mockedResult.productInfo.productOptionGroupList.forEach(value =>
      expectedProductionOptionGroupList.push(value),
    );

    const expectedResult = {
      productInfo: {
        productName: mockedResult.productInfo.productName,
        productPrice: mockedResult.productInfo.productPrice,
        productCode: mockedResult.productInfo.productCode,
        status: mockedResult.productInfo.status,
        productOptionGroupList: expectedProductionOptionGroupList,
      },
    };

    const productCode = faker.lorem.sentence();
    it('should be defined', async () => {
      mockFacade.getProduct.mockReturnValue(mockedResult);
      const res = await controller.findOne(productCode);
      console.log('@@@@@@@@@@' + JSON.stringify(res));
      console.log('@@@@@@@@@@' + faker.commerce.price());
      Logger.log('res -> ' + res);
      // expect(controller.create()).toBeDefined();
      expect(res).toStrictEqual(expectedResult);
    });
  });
});
