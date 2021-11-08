import { Test, TestingModule } from '@nestjs/testing';
import { ProductsPersist } from '../../src/domain/entity/persist/product.persist-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import ProductsStore from '../../src/domain/products.store';
import { ProductsStoreImpl } from '../../src/infra/products.store-impl';
import { fixtureProduct } from '../fixture';
import ProductOptionGroup from '../../src/domain/entity/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product-option.entity';
import { Products } from '../../src/domain/entity/product.entity';

const mockRepo = {
  save: jest.fn(),
};

describe('store() 호출시', () => {
  let productsStore: ProductsStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsStoreImpl,
        { provide: getRepositoryToken(ProductsPersist), useValue: mockRepo },
      ],
    }).compile();

    productsStore = module.get<ProductsStore>(ProductsStoreImpl);
  });

  //TODO 이게 맞나 ;;
  describe('올바른 product 가 주어졌으면', () => {
    const persistEntity = fixtureProduct();
    const mockedEntity = new Products(persistEntity);
    const expectedEntity = mockedEntity;
    it('등록된 product 응답', async () => {
      mockRepo.save.mockReturnValue(mockedEntity);
      const res = await productsStore.store(
        persistEntity.productName,
        persistEntity.productPrice,
        persistEntity.productOptionGroupList.map(value => {
          return new ProductOptionGroup(
            value.productOptionGroupName,
            value.productOptionList.map(value1 => {
              return new ProductOption(
                value1.productOptionName,
                value1.ordering,
                value1.productOptionPrice,
              );
            }),
            value.ordering,
          );
        }),
      );
      expect(res).toStrictEqual(expectedEntity);
    });
  });
});
