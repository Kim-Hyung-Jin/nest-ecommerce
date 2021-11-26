import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/domain/product/product.service';
import { ProductCommandMapper } from '../../src/domain/product/product.command.mapper';
import { ProductServiceImpl } from '../../src/domain/product/product.service-impl';
import * as faker from 'faker';
import * as uuid from 'uuid';
import { Product } from '../../src/domain/entity/product/product.entity';
import ProductOptionGroup from '../../src/domain/entity/product/product-option-group.entity';
import ProductOption from '../../src/domain/entity/product/product-option.entity';
import {
  fixtureCreateCommand,
  fixtureProduct,
  fixtureUpdateProductCommand,
  fixtureUpdateProductOptionCommand,
  fixtureUpdateProductOptionGroupCommand,
} from '../fixture';
import { CreateProductCommand } from '../../src/domain/dto/product/product.command';
import { cloneDeep } from 'lodash';
import { ProductInfo } from '../../src/domain/dto/product/product.info';

jest.mock('uuid');

const mockReader = {
  getProductBy: jest.fn(),
  getAllOptionInfoList: jest.fn(),
};

const mockStore = {
  store: jest.fn(),
};

const testProvider = [
  ProductCommandMapper,
  { provide: 'ProductService', useClass: ProductServiceImpl },
  { provide: 'ProductReader', useValue: mockReader },
  { provide: 'ProductStore', useValue: mockStore },
];

async function getTestModule() {
  return await Test.createTestingModule({
    providers: testProvider,
  }).compile();
}

describe('register() 호출시', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<ProductService>('ProductService');
  });

  describe('올바른 데이터가 주어지면', () => {
    function makeExpectedEntity(command: CreateProductCommand) {
      const expectedEntity = new Product(
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
      const expectedInfo = { ...mockedEntity };

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
  let service: ProductService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<ProductService>('ProductService');
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
  let service: ProductService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<ProductService>('ProductService');
  });

  describe('올바른 command 가 주어지면', () => {
    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      const mockRetrievedProduct = makeMockEntity(productCode, '준비중');
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command.productName,
        command.productPrice,
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
    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productPrice;
      const mockRetrievedProduct = makeMockEntity(undefined, '준비중');
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command.productName,
        command.productPrice,
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
    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productName;
      const mockRetrievedProduct = makeMockEntity(productCode, '준비중');
      const mockStoredProduct = makeExpectedUpdatedProduct(
        mockRetrievedProduct,
        command.productName,
        command.productPrice,
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
    it('product 응답', async () => {
      const productCode = faker.datatype.uuid();
      const command = fixtureUpdateProductCommand(productCode);
      delete command.productName;
      delete command.productPrice;
      const mockRetrievedProduct = makeMockEntity(productCode, '준비중');
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
  let service: ProductService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<ProductService>('ProductService');
  });

  describe('올바른 command 가 주어지면', () => {
    function makeUpdatedProduct(
      mockRetrievedEntity: Product,
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
      const mockRetrievedEntity = makeMockProduct(command.id, undefined);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Product = cloneDeep(expectedUpdatedProduct);
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
    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.id;
      const mockRetrievedEntity = makeMockProduct(command.id, undefined);

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);

      await expect(async () => {
        await service.updateProductOptionGroup(command);
      }).rejects.toThrowError(new Error('업데이트 할 optionGroup id가 없음'));
    });
  });

  describe('productOptionGroupName 가 없을 때', () => {
    function makeUpdatedProduct(
      mockRetrievedEntity: Product,
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
      const mockRetrievedEntity = makeMockProduct(command.id, undefined);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Product = cloneDeep(expectedUpdatedProduct);
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
    function makeUpdatedProduct(
      mockRetrievedEntity: Product,
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
      const mockRetrievedEntity = makeMockProduct(command.id, undefined);
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Product = cloneDeep(expectedUpdatedProduct);
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
    it('업데이트된 product 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      delete command.ordering;
      delete command.productOptionGroupName;
      const mockRetrievedEntity = makeMockProduct(command.id, undefined);

      mockReader.getProductBy.mockReturnValue(mockRetrievedEntity);

      await expect(async () => {
        await service.updateProductOptionGroup(command);
      }).rejects.toThrowError(Error('업데이트 할 값이 없음'));
    });
  });
});

describe('updateProductOption() 호출시', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<ProductService>('ProductService');
  });

  describe('올바른 command 가 주어지면', () => {
    function makeUpdatedProduct(
      mockRetrievedEntity: Product,
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
      res: ProductInfo,
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
      const mockRetrievedEntity = makeMockProduct(
        command.optionGroupId,
        command.id,
      );
      const expectedUpdatedProduct = makeUpdatedProduct(
        cloneDeep(mockRetrievedEntity),
        command,
      );
      const mockStoredProduct: Product = cloneDeep(expectedUpdatedProduct);
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

function makeMockProduct(
  optionGroupId: number | undefined,
  optionId: number | undefined,
) {
  const entity = fixtureProduct();

  if (optionGroupId != undefined) {
    Reflect.set(entity.productOptionGroupList[0], 'id', optionGroupId);
  }

  if (optionId != undefined) {
    Reflect.set(
      entity.productOptionGroupList[0].productOptionList[0],
      'id',
      optionId,
    );
  }

  return entity;
}

function makeMockEntity(
  productCode: string | undefined,
  status: string | undefined,
) {
  const mockedEntity = fixtureProduct();
  if (productCode != undefined) {
    Reflect.deleteProperty(mockedEntity, 'productCode');
    Reflect.set(mockedEntity, 'productCode', productCode);
  }

  if (status != undefined) {
    Reflect.deleteProperty(mockedEntity, 'status');
    Reflect.set(mockedEntity, 'status', status);
  }

  return mockedEntity;
}

function makeExpectedUpdatedProduct(
  mockedEntity: Product,
  productName: string,
  productPrice: number,
) {
  const expectedUpdatedProduct = mockedEntity;
  if (productName != undefined) {
    Reflect.deleteProperty(expectedUpdatedProduct, 'productName');
    Reflect.set(expectedUpdatedProduct, 'productName', productName);
  }

  if (productPrice != undefined) {
    Reflect.deleteProperty(expectedUpdatedProduct, 'productPrice');
    Reflect.set(expectedUpdatedProduct, 'productPrice', productPrice);
  }
  return expectedUpdatedProduct;
}
