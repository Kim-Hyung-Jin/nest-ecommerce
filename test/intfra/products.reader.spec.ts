import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { ProductsReaderImpl } from '../../src/infra/products.reader-impl';
import { ProductsPersist } from '../../src/domain/entity/persist/product.persist-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityNotFoundError } from 'typeorm';
import { ProductsReader } from '../../src/domain/products.reader';
import { fixtureProduct } from '../fixture';
import {
  Products,
  ProductStatus,
} from '../../src/domain/entity/product.entity';
import ProductOptionGroup from '../../src/domain/entity/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product-option.entity';
import { ProductsOptionGroupInfo } from '../../src/domain/dto/products.info';

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
        { provide: getRepositoryToken(ProductsPersist), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductsReader>(ProductsReaderImpl);
  });

  describe('올바른 productCode 가 주어졌으면', () => {
    const productCode = faker.datatype.uuid();
    const mockedPersistEntity = fixtureProduct();
    const expectedEntity = new Products(mockedPersistEntity);

    it('조회한 상품 정보 응답', async () => {
      mockRepo.findOne.mockReturnValue(mockedPersistEntity);
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
      }).rejects.toThrowError(
        new EntityNotFoundError(ProductsPersist, productCode),
      );
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
        { provide: getRepositoryToken(ProductsPersist), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductsReader>(ProductsReaderImpl);
  });

  describe('올바른 Products 가 주어졌으면', () => {
    const persistEntity = fixtureProduct();
    const entity = new Products(persistEntity);

    console.log('### -> ' + JSON.stringify(entity));
    const expectedInfo = entity.productOptionGroupList.map(value => {
      return { ...value };
    });

    expectedInfo.map(value => delete value['persist']);
    console.log('expectedInfo: ' + JSON.stringify(expectedInfo));

    // const expectedInfo: ProductsOptionGroupInfo[] = [
    //   ...entity.productOptionGroupList,
    // ];

    it('AllOptionInfoList 응답', () => {
      const res = reader.getAllOptionInfoList(entity);
      expect(res).toEqual(expectedInfo);
    });
  });
});
