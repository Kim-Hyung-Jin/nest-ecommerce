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
    const expectedResult = {
      productInfo: {
        productName: faker.commerce.price,
        productPrice: 30000,
        productCode: 'bca28eff-ce6c-490a-b926-173375856828',
        status: '준비중',
        productOptionGroupList: [
          {
            productOptionGroupName: '사이즈',
            ordering: 1,
            productOptionList: [
              {
                productOptionName: 'LARGE',
                productOptionPrice: 0,
                ordering: 3,
              },
              {
                productOptionName: 'MEDIUM',
                productOptionPrice: 0,
                ordering: 2,
              },
              {
                productOptionName: 'SMALL',
                productOptionPrice: 0,
                ordering: 1,
              },
            ],
          },
          {
            productOptionGroupName: '컬러',
            ordering: 2,
            productOptionList: [
              {
                productOptionName: 'GOLD',
                productOptionPrice: 1000,
                ordering: 2,
              },
              {
                productOptionName: 'RED',
                productOptionPrice: 0,
                ordering: 1,
              },
            ],
          },
        ],
      },
    };

    const productCode = faker.lorem.sentence();
    it('should be defined', async () => {
      mockFacade.getProduct.mockReturnValue(expectedResult);
      const res = await controller.findOne(productCode);
      console.log('@@@@@@@@@@' + JSON.stringify(res));
      console.log('@@@@@@@@@@' + faker.commerce.price());
      Logger.log('res -> ' + res);
      // expect(controller.create()).toBeDefined();
      // expect().toBe('tt3');
    });
  });
});
