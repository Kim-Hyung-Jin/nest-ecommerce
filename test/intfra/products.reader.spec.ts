import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { ProductsReaderImpl } from '../../src/infra/products.reader-impl';
import { Products } from '../../src/domain/entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';
import { ProductsReader } from '../../src/domain/products.reader';
import { fixtureProduct } from '../fixture';

const mockRepo = {
  findOne: jest.fn(),
};

describe('getByProductCode() 호출시', () => {
  let reader: ProductsReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: ProductsReaderImpl, useClass: ProductsReaderImpl },
        { provide: getRepositoryToken(Products), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductsReader>(ProductsReaderImpl);
  });

  describe('올바른 productCode 가 주어졌으면', () => {
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
    const expectedEntity = {
      productCode: mockedEntity.productCode,
      productPrice: mockedEntity.productPrice,
      productName: mockedEntity.productName,
      status: mockedEntity.status,
      productOptionGroupList: mockedEntity.productOptionGroupList,
    };
    it('조회한 상품 정보 응답', async () => {
      mockRepo.findOne.mockReturnValue(mockedEntity);
      const res = await reader.getByProductCode(productCode);
      expect(res).toStrictEqual(expectedEntity);
    });
  });

  describe('존재하지 않는 productCode 가 주어졌으면', () => {
    const productCode = faker.datatype.uuid();
    it('조회한 상품 정보 응답', async () => {
      mockRepo.findOne.mockReturnValue(undefined);
      await expect(async () => {
        await reader.getByProductCode(productCode);
      }).rejects.toThrowError(new EntityNotFoundError(Products, productCode));
    });
  });
});

describe('getAllOptionInfoList() 호출시', () => {
  let reader: ProductsReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: ProductsReaderImpl, useClass: ProductsReaderImpl },
        { provide: getRepositoryToken(Products), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductsReader>(ProductsReaderImpl);
  });

  describe('올바른 Products 가 주어졌으면', () => {
    const entity = fixtureProduct();
    const expectedInfo = entity.productOptionGroupList.map(
      productionOptionGroup => {
        return {
          productOptionGroupName: productionOptionGroup.productOptionGroupName,
          ordering: productionOptionGroup.ordering,
          productOptionList: productionOptionGroup.productOptionList.map(
            productionOptionGroup => {
              return {
                productOptionName: productionOptionGroup.productOptionName,
                productOptionPrice: productionOptionGroup.productOptionPrice,
                ordering: productionOptionGroup.ordering,
              };
            },
          ),
        };
      },
    );

    it('AllOptionInfoList 응답', () => {
      const res = reader.getAllOptionInfoList(entity);
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});
