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
import { Repository } from 'typeorm';
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
        { provide: ProductsReaderImpl, useValue: ProductsReaderImpl }, // TODO provice랑 밑에 imple인지 클래스 원형인지 헷갈리는거 정리
        { provide: getRepositoryToken(Products), useValue: mockRepo },
      ],
    }).compile();

    reader = module.get<ProductsReaderImpl>(ProductsReaderImpl);
  });

  describe('올바른 productCode 가 주어졌으면', () => {
    const productCode = faker.datatype.uuid();
    const mockedEntity = {
      productCode: productCode,
      productPrice: 30000,
      productName: '티셔츠',
      productOptionGroupList: [
        {
          productOptionGroupName: '사이즈',
          ordering: 1,
          productOptionList: [
            {
              productOptionName: 'SMALL',
              productOptionPrice: 0,
              ordering: 1,
            },
            {
              productOptionName: 'MEDIUM',
              productOptionPrice: 0,
              ordering: 2,
            },
            {
              productOptionName: 'LARGE',
              productOptionPrice: 0,
              ordering: 3,
            },
          ],
        },
        {
          productOptionGroupName: '컬러',
          ordering: 2,
          productOptionList: [
            {
              productOptionName: 'RED',
              productOptionPrice: 0,
              ordering: 1,
            },
            {
              productOptionName: 'GOLD',
              productOptionPrice: 1000,
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
    };
    it('조회한 상품 정보 응답', async () => {
      mockRepo.findOne.mockReturnValue(mockedEntity);
      const res = await reader.getByProductCode(productCode);
      expect(res).toStrictEqual(expectedEntity);
    });
  });
});
