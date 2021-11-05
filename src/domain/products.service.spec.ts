import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsServiceImpl } from './products.service-impl';
import * as faker from 'faker';
import { v4 } from 'uuid';

const mockReader = {
  getByProductCode: jest.fn(),
  getAllOptionInfoList: jest.fn(),
};

const mockStore = {
  store: jest.fn(),
};

describe('register() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 데이터가 주어지면', () => {
    it('등록된 productCode 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = {
        productName: faker.commerce.productName(),
        productPrice: faker.commerce.price(),
        productOptionGroupList: [
          {
            productOptionGroupName: faker.commerce.productName(),
            ordering: 1,
            productOptionList: [
              {
                productOptionName: faker.commerce.color(),
                productOptionPrice: faker.commerce.price(),
                ordering: 1,
              },
              {
                productOptionName: faker.commerce.color(),
                productOptionPrice: faker.commerce.price(),
                ordering: 2,
              },
              {
                productOptionName: faker.commerce.color(),
                productOptionPrice: faker.commerce.price(),
                ordering: 3,
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
                ordering: 1,
              },
              {
                productOptionName: faker.commerce.color(),
                productOptionPrice: faker.commerce.price(),
                ordering: 2,
              },
            ],
          },
        ],
      };
      const expectedEntity = {
        productCode: productCode,
        productPrice: command.productPrice,
        productName: command.productName,
        status: '준비중',
        productOptionGroupList: [
          {
            productOptionGroupName:
              command.productOptionGroupList[0].productOptionGroupName,
            ordering: 1,
            productOptionList: [
              {
                productOptionName:
                  command.productOptionGroupList[0].productOptionList[0]
                    .productOptionName,
                productOptionPrice:
                  command.productOptionGroupList[0].productOptionList[0]
                    .productOptionPrice,
                ordering: 1,
              },
              {
                productOptionName:
                  command.productOptionGroupList[0].productOptionList[1]
                    .productOptionName,
                productOptionPrice:
                  command.productOptionGroupList[0].productOptionList[1]
                    .productOptionPrice,
                ordering: 2,
              },
              {
                productOptionName:
                  command.productOptionGroupList[0].productOptionList[2]
                    .productOptionName,
                productOptionPrice:
                  command.productOptionGroupList[0].productOptionList[2]
                    .productOptionPrice,
                ordering: 3,
              },
            ],
          },
          {
            productOptionGroupName:
              command.productOptionGroupList[1].productOptionGroupName,
            ordering: 2,
            productOptionList: [
              {
                productOptionName:
                  command.productOptionGroupList[1].productOptionList[0]
                    .productOptionName,
                productOptionPrice:
                  command.productOptionGroupList[1].productOptionList[0]
                    .productOptionPrice,
                ordering: 1,
              },
              {
                productOptionName:
                  command.productOptionGroupList[1].productOptionList[1]
                    .productOptionName,
                productOptionPrice:
                  command.productOptionGroupList[1].productOptionList[1]
                    .productOptionPrice,
                ordering: 2,
              },
            ],
          },
        ],
      };
      const mockedEntity = {
        id: faker.datatype.number(),
        productCode: productCode,
        productPrice: expectedEntity,
        productName: expectedEntity.productName,
        status: '준비중',
        productOptionGroupList: expectedEntity.productOptionGroupList,
      };
      const expectedInfo = {
        productName: mockedEntity.productName,
        productPrice: mockedEntity.productPrice,
        productCode: mockedEntity.productCode,
        status: mockedEntity.status,
        productOptionGroupList: mockedEntity.productOptionGroupList,
      };
      mockStore.store.mockReturnValue(mockedEntity);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockedEntity.productOptionGroupList,
      );
      v4.uuidv4 = jest.fn().mockReturnValue(productCode);
      const res = await service.register(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedEntity);
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});
