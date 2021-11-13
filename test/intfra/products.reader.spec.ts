import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductCommandMapper } from '../../src/domain/product.command.mapper';
import { ProductReaderImpl } from '../../src/infra/product.reader-impl';
import { Product } from '../../src/domain/entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';
import { ProductReader } from '../../src/domain/product.reader';
import { fixtureProduct } from '../fixture';

const mockRepo = {
  findOne: jest.fn(),
};

describe('getByProductCode() 호출시', () => {
  let reader: ProductReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCommandMapper,
        { provide: ProductReaderImpl, useClass: ProductReaderImpl },
        { provide: getRepositoryToken(Product), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductReader>(ProductReaderImpl);
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
      const res = await reader.getProductBy(productCode);
      expect(res).toStrictEqual(expectedEntity);
    });
  });

  describe('존재하지 않는 productCode 가 주어졌으면', () => {
    const productCode = faker.datatype.uuid();
    it('조회한 상품 정보 응답', async () => {
      mockRepo.findOne.mockReturnValue(undefined);
      await expect(async () => {
        await reader.getProductBy(productCode);
      }).rejects.toThrowError(new EntityNotFoundError(Product, productCode));
    });
  });
});

describe('getAllOptionInfoList() 호출시', () => {
  let reader: ProductReader;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCommandMapper,
        { provide: ProductReaderImpl, useClass: ProductReaderImpl },
        { provide: getRepositoryToken(Product), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductReader>(ProductReaderImpl);
  });

  describe('올바른 Product 가 주어졌으면', () => {
    const entity = fixtureProduct();
    const expectedInfo = entity.productOptionGroupList.map(
      productionOptionGroup => {
        return {
          id: productionOptionGroup.id,
          productOptionGroupName: productionOptionGroup.productOptionGroupName,
          ordering: productionOptionGroup.ordering,
          productOptionList: productionOptionGroup.productOptionList.map(
            productionOptionGroup => {
              return {
                id: productionOptionGroup.id,
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
