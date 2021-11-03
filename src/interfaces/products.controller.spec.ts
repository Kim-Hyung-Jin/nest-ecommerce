import { Test, TestingModule } from '@nestjs/testing';
import ProductsController from './products.controller';
import ProductsFacade from '../application/products.facade';
import * as faker from 'faker';
import { ProductsDtoMapper } from './products-dto.mapper';
import { Logger } from '@nestjs/common';

const mockFacade = {
  registerProduct: jest.fn(),
  getProduct: jest.fn(),
};

describe('[GET] /products', () => {
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

  describe('올바른 상품 코드로 조회 시', () => {
    const expectedResult = {
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

    const productCode = faker.lorem.sentence();
    it('should be defined', async () => {
      mockFacade.getProduct.mockReturnValue(expectedResult);
      const res = await controller.findOne(productCode);
      Logger.log('res -> ' + res);
      console.log('res -> ' + JSON.stringify(res));
      // expect(controller.create()).toBeDefined();
      // expect().toBe('tt3');
    });
  });
});
