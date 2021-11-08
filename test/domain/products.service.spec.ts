import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import * as faker from 'faker';
// import { v4 } from 'uuid';
import * as uuid from 'uuid';
import { ProductsPersist } from '../../src/domain/entity/persist/product.persist-entity';
import ProductOptionGroupPersist from '../../src/domain/entity/persist/product-option-group.persist-entity';
import ProductOptionPersist from '../../src/domain/entity/persist/product-option.persist-entity';
import { Products } from '../../src/domain/entity/product.entity';

jest.mock('uuid');

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
      jest.spyOn(uuid, 'v4').mockReturnValue(productCode);
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
      // const expectedPersistEntity = new ProductsPersist(
      //   command.productName,
      //   command.productPrice,
      //   command.productOptionGroupList.map(
      //     value =>
      //       new ProductOptionGroupPersist(
      //         value.productOptionGroupName,
      //         value.ordering,
      //         value.productOptionList.map(
      //           value1 =>
      //             new ProductOptionPersist(
      //               value1.productOptionName,
      //               value1.ordering,
      //               value1.productOptionPrice,
      //             ),
      //         ),
      //       ),
      //   ),
      // );
      const expectedPersistEntity = new ProductsPersist(
        command.productName,
        command.productPrice,
        command.productOptionGroupList.map(
          value =>
            new ProductOptionGroupPersist(
              value.productOptionGroupName,
              value.ordering,
              value.productOptionList.map(
                value1 =>
                  new ProductOptionPersist(
                    value1.productOptionName,
                    value1.ordering,
                    value1.productOptionPrice,
                  ),
              ),
            ),
        ),
      );

      const mockedEntity = new Products(expectedPersistEntity);

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

      const res = await service.register(command);
      expect(mockStore.store).toHaveBeenCalledWith(command);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockedEntity,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});

describe('getOne() 호출시', () => {
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

  describe('올바른 productCode 가 주어지면', () => {
    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const mockedEntity = {
        productCode: productCode,
        productName: faker.commerce.productName(),
        productPrice: faker.commerce.price(),
        status: '준비중',
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
      mockReader.getByProductCode.mockReturnValue(mockedEntity);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockedEntity.productOptionGroupList,
      );
      const expectedEntity = {
        productCode: productCode,
        productPrice: mockedEntity.productPrice,
        productName: mockedEntity.productName,
        status: '준비중',
        productOptionGroupList: [
          {
            productOptionGroupName:
              mockedEntity.productOptionGroupList[0].productOptionGroupName,
            ordering: 1,
            productOptionList: [
              {
                productOptionName:
                  mockedEntity.productOptionGroupList[0].productOptionList[0]
                    .productOptionName,
                productOptionPrice:
                  mockedEntity.productOptionGroupList[0].productOptionList[0]
                    .productOptionPrice,
                ordering: 1,
              },
              {
                productOptionName:
                  mockedEntity.productOptionGroupList[0].productOptionList[1]
                    .productOptionName,
                productOptionPrice:
                  mockedEntity.productOptionGroupList[0].productOptionList[1]
                    .productOptionPrice,
                ordering: 2,
              },
              {
                productOptionName:
                  mockedEntity.productOptionGroupList[0].productOptionList[2]
                    .productOptionName,
                productOptionPrice:
                  mockedEntity.productOptionGroupList[0].productOptionList[2]
                    .productOptionPrice,
                ordering: 3,
              },
            ],
          },
          {
            productOptionGroupName:
              mockedEntity.productOptionGroupList[1].productOptionGroupName,
            ordering: 2,
            productOptionList: [
              {
                productOptionName:
                  mockedEntity.productOptionGroupList[1].productOptionList[0]
                    .productOptionName,
                productOptionPrice:
                  mockedEntity.productOptionGroupList[1].productOptionList[0]
                    .productOptionPrice,
                ordering: 1,
              },
              {
                productOptionName:
                  mockedEntity.productOptionGroupList[1].productOptionList[1]
                    .productOptionName,
                productOptionPrice:
                  mockedEntity.productOptionGroupList[1].productOptionList[1]
                    .productOptionPrice,
                ordering: 2,
              },
            ],
          },
        ],
      };
      const expectedInfo = {
        productName: mockedEntity.productName,
        productPrice: mockedEntity.productPrice,
        productCode: mockedEntity.productCode,
        status: mockedEntity.status,
        productOptionGroupList: mockedEntity.productOptionGroupList,
      };
      const res = await service.getOne(productCode);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        expectedEntity,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});
