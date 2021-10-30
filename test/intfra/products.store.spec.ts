import { Test, TestingModule } from '@nestjs/testing';
import { Products } from '../../src/domain/entity/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import ProductsStore from '../../src/domain/products.store';
import { ProductsStoreImpl } from '../../src/infra/products.store-impl';
import { fixtureProduct } from '../fixture';

const mockRepo = {
  save: jest.fn(),
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

  //TODO 이게 맞나 ;;
  describe('올바른 product 가 주어졌으면', () => {
    const entity = fixtureProduct();
    const mockedEntity = entity;
    const expectedEntity = entity;
    it('등록된 product 응답', async () => {
      mockRepo.save.mockReturnValue(mockedEntity);
      const res = await productsStore.store(entity);
      expect(res).toStrictEqual(expectedEntity);
    });
  });
});
