import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import * as faker from 'faker';
// import { v4 } from 'uuid';
import * as uuid from 'uuid';
import { Products } from '../../src/domain/entity/product.entity';
import ProductOptionGroup from '../../src/domain/entity/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product-option.entity';
import { fixtureCreateCommand } from '../fixture';
import { CreateProductCommand } from '../../src/domain/dto/create-product.command';

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
    function makeExpectedEntity(command: CreateProductCommand) {
      const expectedEntity = new Products(
        command.productName,
        command.productPrice,
        command.productOptionGroupList.map(
          value =>
            new ProductOptionGroup(
              value.productOptionGroupName,
              value.ordering,
              value.productOptionList.map(
                value1 =>
                  new ProductOption(
                    value1.productOptionName,
                    value1.ordering,
                    value1.productOptionPrice,
                  ),
              ),
            ),
        ),
      );
      return expectedEntity;
    }

    it('등록된 productCode 응답', async () => {
      const productCode = faker.datatype.uuid();
      jest.spyOn(uuid, 'v4').mockReturnValue(productCode);
      const command = fixtureCreateCommand();
      const expectedEntity = makeExpectedEntity(command);
      const mockedEntity = expectedEntity;
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
      expect(mockStore.store).toHaveBeenCalledWith(expectedEntity);
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
    function makeMockedEntity(productCode) {
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
      return mockedEntity;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const mockedEntity = makeMockedEntity(productCode);
      const expectedEntity = { ...mockedEntity };
      const expectedInfo = { ...mockedEntity };

      mockReader.getByProductCode.mockReturnValue(mockedEntity);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockedEntity.productOptionGroupList,
      );

      const res = await service.getOne(productCode);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        expectedEntity,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});
