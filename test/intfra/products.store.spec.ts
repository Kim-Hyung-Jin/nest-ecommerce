import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../src/domain/entity/product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import ProductStore from '../../src/domain/product/product.store';
import { ProductStoreImpl } from '../../src/infra/product.store-impl';
import { fixtureProduct } from '../fixture';

const mockRepo = {
  save: jest.fn(),
};

describe('store() 호출시', () => {
  let productStore: ProductStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductStoreImpl,
        { provide: getRepositoryToken(Product), useValue: mockRepo },
      ],
    }).compile();

    productStore = module.get<ProductStore>(ProductStoreImpl);
  });

  //TODO 이게 맞나 ;;
  describe('올바른 product 가 주어졌으면', () => {
    const entity = fixtureProduct();
    const mockedEntity = entity;
    const expectedEntity = entity;
    it('등록된 product 응답', async () => {
      mockRepo.save.mockReturnValue(mockedEntity);
      const res = await productStore.store(entity);
      expect(res).toStrictEqual(expectedEntity);
    });
  });
});
