import { Test, TestingModule } from '@nestjs/testing';
import { ProductsServiceImpl } from './products.service-impl';
import { ProductsService } from './products.service';
import { ProductsReaderImpl } from '../infra/products.reader-impl';
import { ProductsStoreImpl } from '../infra/products.store-impl';
import { MockType } from '../common/mock.helper';
import { ProductsReader } from './products.reader';

describe('ProductsService', () => {
  let service: ProductsService;
  // let mockReader: MockType<ProductsReaderImpl>;
  // let mockStore: MockType<ProductsStoreImpl>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ProductsServiceImpl, useValue: ProductsServiceImpl },
        { provide: ProductsReaderImpl, useValue: ProductsReaderImpl },
        { provide: ProductsStoreImpl, useValue: ProductsStoreImpl },
      ],
    }).compile();

    service = module.get<ProductsServiceImpl>(ProductsServiceImpl);
    // mockReader = graphql.get<MockType<ProductsReader>>(ProductsReaderImpl);
    // mockStore = graphql.get<MockType<ProductsStoreImpl>>(ProductsStoreImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
