import { Test, TestingModule } from '@nestjs/testing';
import ProductController from '../../src/interfaces/product.controller';
import ProductFacade from '../../src/application/product.facade';
import * as faker from 'faker';
import { ProductDtoMapper } from '../../src/interfaces/product-dto.mapper';
import { Logger } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { Product } from '../../src/domain/entity/product/product.entity';

const mockFacade = {
  register: jest.fn(),
  getOne: jest.fn(),
};

describe('[GET] /products', () => {
  let controller: ProductController;
  let facade: ProductFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductFacade,
          useValue: mockFacade,
        },
        ProductDtoMapper,
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    facade = module.get<ProductFacade>(ProductFacade);
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
      mockFacade.getOne.mockReturnValue(expectedResult);
      const res = await controller.getOne(productCode);
      Logger.log('res -> ' + res);
    });
  });
});

describe('[POST] /products', () => {
  let controller: ProductController;
  let facade: ProductFacade;
  let mapper: ProductDtoMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductFacade,
          useValue: mockFacade,
        },
        ProductDtoMapper,
      ],
      controllers: [ProductController],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    facade = module.get<ProductFacade>(ProductFacade);
    mapper = module.get<ProductDtoMapper>(ProductDtoMapper);
  });

  describe('올바른 상품 코드로 등록 시', () => {
    const request = {
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

    const command = {
      productName: request.productName,
      productPrice: request.productPrice,
      productOptionGroupList: request.productOptionGroupList,
    };

    const expectedResult = {
      productInfo: {
        productName: request.productName,
        productPrice: request.productPrice,
        productCode: request.productCode,
        status: request.status,
        productOptionGroupList: request.productOptionGroupList,
      },
    };

    const expectedResponse = {
      productCode: expectedResult.productInfo.productCode,
    };

    it('등록된 상품 코드 응답', async () => {
      mockFacade.register.mockReturnValue(expectedResult);
      const res = await controller.create(request);
      expect(mockFacade.register).toHaveBeenCalledWith(command);
      expect(res).toStrictEqual(expectedResponse);
    });
  });
});
