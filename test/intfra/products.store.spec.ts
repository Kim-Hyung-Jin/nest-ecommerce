import { Test, TestingModule } from '@nestjs/testing';
import ProductsFacade from '../../src/application/products.facade';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { MockType } from '../../src/common/mock.helper';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import { ProductsReaderImpl } from '../../src/infra/products.reader-impl';
import { Products } from '../../src/domain/entity/product.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import ProductOptionGroup from '../../src/domain/entity/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product-option.entity';
import { ProductsReader } from '../../src/domain/products.reader';
import ProductsStore from '../../src/domain/products.store';
import { ProductsStoreImpl } from '../../src/infra/products.store-impl';

const mockRepo = {
  findOne: jest.fn(),
};

describe('store() 호출시', () => {
  let productsStore: ProductsStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsStoreImpl,
        { provide: getRepositoryToken(Products), useValue: mockRepo },
      ],
    }).compile();

    productsStore = module.get<ProductsStore>(ProductsStoreImpl);
  });

  describe('올바른 product 가 주어졌으면', () => {});
});
