import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import * as faker from 'faker';
import * as uuid from 'uuid';
import { Products } from '../../src/domain/entity/product.entity';
import ProductOptionGroup from '../../src/domain/entity/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product-option.entity';
import {
  fixtureCreateCommand,
  fixtureProduct,
  fixtureUpdateProductCommand,
  fixtureUpdateProductOptionCommand,
  fixtureUpdateProductOptionGroupCommand,
} from '../fixture';
import { CreateProductCommand } from '../../src/domain/dto/create-product.command';
import { cloneDeep } from 'lodash';
import { ProductsInfo } from '../../src/domain/dto/products.info';

jest.mock('uuid');

const mockReader = {
  getProductBy: jest.fn(),
  getAllOptionInfoList: jest.fn(),
};

const mockStore = {
  store: jest.fn(),
};

describe('register() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 데이터가 주어지면', () => {
    function makeExpectedEntity(command: CreateProductCommand) {
      const expectedEntity = new Products(
        command.productName,
        command.productPrice,
        command.productOptionGroupList.map(
          value =>
            new ProductOptionGroup(
              value.productOptionGroupName,
              value.ordering,
              value.productOptionList.map(
                value1 =>
                  new ProductOption(
                    value1.productOptionName,
                    value1.ordering,
                    value1.productOptionPrice,
                  ),
              ),
            ),
        ),
      );
      return expectedEntity;
    }

    it('등록된 productCode 응답', async () => {
      const productCode = faker.datatype.uuid();
      jest.spyOn(uuid, 'v4').mockReturnValue(productCode);
      const command = fixtureCreateCommand();
      const expectedEntity = makeExpectedEntity(command);
      const mockedEntity = expectedEntity;
      const expectedInfo = {
        productName: mockedEntity.productName,
        productPrice: mockedEntity.productPrice,
        productCode: mockedEntity.productCode,
        status: mockedEntity.status,
        productOptionGroupList: mockedEntity.productOptionGroupList,
      };

      mockStore.store.mockReturnValue(mockedEntity);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockedEntity.productOptionGroupList,
      );

      const res = await service.register(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedEntity);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockedEntity,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});

describe('getOne() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 productCode 가 주어지면', () => {
    function makeMockedEntity(productCode) {
      const mockedEntity = fixtureProduct();
      Reflect.set(mockedEntity, 'productCode', productCode);
      Reflect.set(mockedEntity, 'status', '준비중');
      return mockedEntity;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const mockedEntity = makeMockedEntity(productCode);
      const expectedEntity = { ...mockedEntity };
      const expectedInfo = { ...mockedEntity };

      mockReader.getProductBy.mockReturnValue(mockedEntity);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockedEntity.productOptionGroupList,
      );

      const res = await service.getOne(productCode);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        expectedEntity,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });
});

describe('updateProduct() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 command 가 주어지면', () => {
    function makeMockEntity(productCode) {
      const mockedEntity = fixtureProduct();
      Reflect.deleteProperty(mockedEntity, 'productCode');
      Reflect.deleteProperty(mockedEntity, 'status');
      Reflect.set(mockedEntity, 'productCode', productCode);
      Reflect.set(mockedEntity, 'status', '준비중');

      return mockedEntity;
    }

    function makeExpectedUpdatedProduct(
      mockedEntity,
      command: { productCode: any; productName: any; productPrice: any },
    ) {
      const expectedUpdatedProduct = mockedEntity;
      Reflect.deleteProperty(expectedUpdatedProduct, 'productName');
      Reflect.deleteProperty(expectedUpdatedProduct, 'productPrice');
      Reflect.set(expectedUpdatedProduct, 'productName', command.productName);
      Reflect.set(expectedUpdatedProduct, 'productPrice', command.productPrice);
      return expectedUpdatedProduct;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      const mockRetrievedProduct = makeMockEntity(productCode);
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command,
      );
      const updatedProduct = mockStoredProduct;
      const expectedInfo = { ...updatedProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedProduct);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockRetrievedProduct.productOptionGroupList,
      );

      const res = await service.updateProduct(command);
      expect(mockReader.getProductBy).toHaveBeenCalledWith(command.productCode);
      expect(mockStore.store).toHaveBeenCalledWith(updatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        updatedProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });

  describe('productPrice 만 빈값으로 주어지면', () => {
    function makeMockEntity(productCode) {
      const mockedEntity = fixtureProduct();
      Reflect.deleteProperty(mockedEntity, 'productCode');
      Reflect.deleteProperty(mockedEntity, 'status');
      Reflect.set(mockedEntity, 'productCode', productCode);
      Reflect.set(mockedEntity, 'status', '준비중');

      return mockedEntity;
    }

    function makeExpectedUpdatedProduct(
      mockedEntity,
      command: { productCode: any; productName: any; productPrice: any },
    ) {
      const expectedUpdatedProduct = mockedEntity;
      Reflect.deleteProperty(expectedUpdatedProduct, 'productName');
      Reflect.deleteProperty(expectedUpdatedProduct, 'productPrice');
      Reflect.set(expectedUpdatedProduct, 'productName', command.productName);
      Reflect.set(expectedUpdatedProduct, 'productPrice', command.productPrice);
      return expectedUpdatedProduct;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productPrice;
      const mockRetrievedProduct = makeMockEntity(productCode);
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command,
      );
      const updatedProduct = mockStoredProduct;
      const expectedInfo = { ...updatedProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedProduct);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockRetrievedProduct.productOptionGroupList,
      );

      const res = await service.updateProduct(command);
      expect(mockReader.getProductBy).toHaveBeenCalledWith(command.productCode);
      expect(mockStore.store).toHaveBeenCalledWith(updatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        updatedProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });

  describe('productName 만 빈값으로 주어지면', () => {
    function makeMockEntity(productCode) {
      const mockedEntity = fixtureProduct();
      Reflect.deleteProperty(mockedEntity, 'productCode');
      Reflect.deleteProperty(mockedEntity, 'status');
      Reflect.set(mockedEntity, 'productCode', productCode);
      Reflect.set(mockedEntity, 'status', '준비중');

      return mockedEntity;
    }

    function makeExpectedUpdatedProduct(
      mockedEntity,
      command: { productCode: any; productName: any; productPrice: any },
    ) {
      const expectedUpdatedProduct = mockedEntity;
      Reflect.deleteProperty(expectedUpdatedProduct, 'productName');
      Reflect.deleteProperty(expectedUpdatedProduct, 'productPrice');
      Reflect.set(expectedUpdatedProduct, 'productName', command.productName);
      Reflect.set(expectedUpdatedProduct, 'productPrice', command.productPrice);
      return expectedUpdatedProduct;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productName;
      const mockRetrievedProduct = makeMockEntity(productCode);
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command,
      );
      const updatedProduct = mockStoredProduct;
      const expectedInfo = { ...updatedProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedProduct);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(
        mockRetrievedProduct.productOptionGroupList,
      );

      const res = await service.updateProduct(command);
      expect(mockReader.getProductBy).toHaveBeenCalledWith(command.productCode);
      expect(mockStore.store).toHaveBeenCalledWith(updatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        updatedProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
    });
  });

  describe('productName, productPrice 모두 빈값으로 주어지면', () => {
    function makeMockEntity(productCode) {
      const mockedEntity = fixtureProduct();
      Reflect.deleteProperty(mockedEntity, 'productCode');
      Reflect.deleteProperty(mockedEntity, 'status');
      Reflect.set(mockedEntity, 'productCode', productCode);
      Reflect.set(mockedEntity, 'status', '준비중');

      return mockedEntity;
    }

    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productName;
      delete command.productPrice;
      const mockRetrievedProduct = makeMockEntity(productCode);
      mockReader.getProductBy.mockReturnValue(mockRetrievedProduct);

      // TODO async 인 이유 확인
      await expect(async () => {
        await service.updateProduct(command);
      }).rejects.toThrowError(new Error('업데이트 할 값이 없음'));
      expect(mockReader.getProductBy).toHaveBeenCalledWith(command.productCode);
    });
  });
});

describe('updateProductOptionGroup() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 command 가 주어지면', () => {
    function makeMockProduct(command: {
      productCode: any;
      ordering: any;
      id: any;
      productOptionGroupName: any;
    }) {
      const entity = fixtureProduct();
      Reflect.set(entity.productOptionGroupList[0], 'id', command.id);
      return entity;
    }

    function makeUpdatedProduct(
      mockRetrievedEntity: Products,
      command: {
        productCode: any;
        ordering: any;
        id: any;
        productOptionGroupName: any;
      },
    ) {
      const targetOptionGroup = mockRetrievedEntity.productOptionGroupList.find(
        value => value.id == command.id,
      );
      targetOptionGroup.productOptionGroupName = command.productOptionGroupName;
      targetOptionGroup.ordering = command.ordering;

      return mockRetrievedEntity;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      const mockRetrievedEntity = makeMockProduct(command);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Products = cloneDeep(expectedUpdatedProduct);
      const mockOptionInfoList = mockStoredProduct.productOptionGroupList;
      const expectedInfo = { ...mockStoredProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(mockOptionInfoList);

      const res = await service.updateProductOptionGroup(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedUpdatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockStoredProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
      const targetOptionGroup = res.productOptionGroupList.find(
        value => value.id == command.id,
      );
      expect(targetOptionGroup.ordering).toStrictEqual(command.ordering);
      expect(targetOptionGroup.productOptionGroupName).toStrictEqual(
        command.productOptionGroupName,
      );
    });
  });

  describe('optionGroupId 가 없을 때', () => {
    function makeMockProduct(command: {
      productCode: any;
      ordering: any;
      id: any;
      productOptionGroupName: any;
    }) {
      const entity = fixtureProduct();
      Reflect.set(entity.productOptionGroupList[0], 'id', command.id);
      return entity;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.id;
      const mockRetrievedEntity = makeMockProduct(command);

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);

      await expect(async () => {
        await service.updateProductOptionGroup(command);
      }).rejects.toThrowError(new Error('업데이트 할 optionGroup id가 없음'));
    });
  });

  describe('productOptionGroupName 가 없을 때', () => {
    function makeMockProduct(command: {
      productCode: any;
      ordering: any;
      id: any;
      productOptionGroupName: any;
    }) {
      const entity = fixtureProduct();
      Reflect.set(entity.productOptionGroupList[0], 'id', command.id);
      return entity;
    }

    function makeUpdatedProduct(
      mockRetrievedEntity: Products,
      command: {
        productCode: any;
        ordering: any;
        id: any;
        productOptionGroupName: any;
      },
    ) {
      const targetOptionGroup = mockRetrievedEntity.productOptionGroupList.find(
        value => value.id == command.id,
      );
      targetOptionGroup.productOptionGroupName = command.productOptionGroupName;
      targetOptionGroup.ordering = command.ordering;

      return mockRetrievedEntity;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.productOptionGroupName;
      const mockRetrievedEntity = makeMockProduct(command);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Products = cloneDeep(expectedUpdatedProduct);
      const mockOptionInfoList = mockStoredProduct.productOptionGroupList;
      const expectedInfo = { ...mockStoredProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(mockOptionInfoList);

      const res = await service.updateProductOptionGroup(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedUpdatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockStoredProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
      const targetOptionGroup = res.productOptionGroupList.find(
        value => value.id == command.id,
      );
      expect(targetOptionGroup.ordering).toStrictEqual(command.ordering);
      expect(targetOptionGroup.productOptionGroupName).toStrictEqual(
        command.productOptionGroupName,
      );
    });
  });

  describe('ordering 가 없을 때', () => {
    function makeMockProduct(command: {
      productCode: any;
      ordering: any;
      id: any;
      productOptionGroupName: any;
    }) {
      const entity = fixtureProduct();
      Reflect.set(entity.productOptionGroupList[0], 'id', command.id);
      return entity;
    }

    function makeUpdatedProduct(
      mockRetrievedEntity: Products,
      command: {
        productCode: any;
        ordering: any;
        id: any;
        productOptionGroupName: any;
      },
    ) {
      const targetOptionGroup = mockRetrievedEntity.productOptionGroupList.find(
        value => value.id == command.id,
      );
      targetOptionGroup.productOptionGroupName = command.productOptionGroupName;
      targetOptionGroup.ordering = command.ordering;

      return mockRetrievedEntity;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.ordering;
      const mockRetrievedEntity = makeMockProduct(command);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Products = cloneDeep(expectedUpdatedProduct);
      const mockOptionInfoList = mockStoredProduct.productOptionGroupList;
      const expectedInfo = { ...mockStoredProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(mockOptionInfoList);

      const res = await service.updateProductOptionGroup(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedUpdatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockStoredProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
      const targetOptionGroup = res.productOptionGroupList.find(
        value => value.id == command.id,
      );
      expect(targetOptionGroup.ordering).toStrictEqual(command.ordering);
      expect(targetOptionGroup.productOptionGroupName).toStrictEqual(
        command.productOptionGroupName,
      );
    });
  });

  describe('productOptionGroupName, ordering 가 없을 때', () => {
    function makeMockProduct(command: {
      productCode: any;
      ordering: any;
      id: any;
      productOptionGroupName: any;
    }) {
      const entity = fixtureProduct();
      Reflect.set(entity.productOptionGroupList[0], 'id', command.id);
      return entity;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.ordering;
      delete command.productOptionGroupName;
      const mockRetrievedEntity = makeMockProduct(command);

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);

      await expect(async () => {
        await service.updateProductOptionGroup(command);
      }).rejects.toThrowError(Error('업데이트 할 값이 없음'));
    });
  });
});

describe('updateProductOption() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsCommandMapper,
        { provide: 'ProductsService', useClass: ProductsServiceImpl },
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsService>('ProductsService');
  });

  describe('올바른 command 가 주어지면', () => {
    function makeMockProduct(command: {
      optionGroupId: number;
      productCode: string;
      id: number;
      productOptionName: string;
      ordering: number;
      productOptionPrice: number;
    }) {
      const entity = fixtureProduct();
      Reflect.set(
        entity.productOptionGroupList[0],
        'id',
        command.optionGroupId,
      );
      Reflect.set(
        entity.productOptionGroupList[0].productOptionList[0],
        'id',
        command.id,
      );
      return entity;
    }

    function makeUpdatedProduct(
      mockRetrievedEntity: Products,
      command: {
        optionGroupId: number;
        productCode: string;
        id: number;
        productOptionName: string;
        ordering: number;
        productOptionPrice: number;
      },
    ) {
      const targetOptionGroup = mockRetrievedEntity.productOptionGroupList.find(
        value => value.id == command.optionGroupId,
      );
      const targetOption = targetOptionGroup.productOptionList.find(
        value => value.id == command.id,
      );
      targetOption.productOptionName = command.productOptionName;
      targetOption.ordering = command.ordering;
      targetOption.productOptionPrice = command.productOptionPrice;
      return mockRetrievedEntity;
    }

    function getTargetOption(
      res: ProductsInfo,
      command: {
        productOptionName: any;
        productCode: any;
        ordering: any;
        id: any;
        optionGroupId: any;
        productOptionPrice: any;
      },
    ) {
      const targetOptionGroup = res.productOptionGroupList.find(
        value => value.id == command.optionGroupId,
      );
      const targetOption = targetOptionGroup.productOptionList.find(
        value => value.id == command.id,
      );
      return targetOption;
    }

    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionCommand();
      const mockRetrievedEntity = makeMockProduct(command);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Products = cloneDeep(expectedUpdatedProduct);
      const mockOptionInfoList = mockStoredProduct.productOptionGroupList;
      const expectedInfo = { ...mockStoredProduct };

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);
      mockStore.store.mockReturnValue(mockStoredProduct);
      mockReader.getAllOptionInfoList.mockReturnValue(mockOptionInfoList);

      const res = await service.updateProductOption(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedUpdatedProduct);
      expect(mockReader.getAllOptionInfoList).toHaveBeenCalledWith(
        mockStoredProduct,
      );
      expect(res).toStrictEqual(expectedInfo);
      const targetOption = getTargetOption(res, command);
      expect(targetOption.ordering).toStrictEqual(command.ordering);
      expect(targetOption.productOptionPrice).toStrictEqual(
        command.productOptionPrice,
      );
      expect(targetOption.productOptionName).toStrictEqual(
        command.productOptionName,
      );
    });
  });
});
