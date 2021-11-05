import { Test, TestingModule } from '@nestjs/testing';
import ProductsFacade from '../application/products.facade';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { MockType } from '../common/mock.helper';
import { ProductsService } from '../domain/products.service';
import { ProductsServiceImpl } from '../domain/products.service-impl';
import { ProductsReaderImpl } from './products.reader-impl';
import { Products } from '../domain/entity/product.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import ProductOptionGroup from '../domain/entity/product-option-group.entity';
import ProductOption from '../domain/entity/product-option.entity';
import { ProductsReader } from '../domain/products.reader';

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
        //TODO 왜 여기만 await except지
        await reader.getByProductCode(productCode);
      }).rejects.toThrowError(new EntityNotFoundError(Products, productCode));
    });
  });
});
