import { Test, TestingModule } from '@nestjs/testing';
import ProductsFacade from '../../src/application/products.facade';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { MockType } from '../../src/common/mock.helper';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import {
  fixtureCreateCommand,
  fixtureInfo,
  fixtureProduct,
  fixtureUpdateProductCommand,
  fixtureUpdateProductOptionCommand,
  fixtureUpdateProductOptionGroupCommand,
} from '../fixture';

const mockService = {
  register: jest.fn(),
  getOne: jest.fn(),
  updateProduct: jest.fn(),
  updateProductOptionGroup: jest.fn(),
  updateProductOption: jest.fn(),
};

describe('register() 호출시', () => {
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsFacade,
        ProductsCommandMapper,
        { provide: 'ProductsService', useValue: mockService },
      ],
    }).compile();

    facade = module.get<ProductsFacade>(ProductsFacade);
  });

  describe('정상적인 command 가 주어졌으면', () => {
    const command = fixtureCreateCommand();
    const mockedInfo = {
      ...command,
      status: '준비중',
    };
    const expectedResult = {
      productInfo: mockedInfo,
    };

    it('등록된 상품 정보 응답', async () => {
      mockService.register.mockReturnValue(mockedInfo);
      const res = await facade.register(command);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('getOne() 호출시', () => {
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsFacade,
        ProductsCommandMapper,
        { provide: 'ProductsService', useValue: mockService },
      ],
    }).compile();

    facade = module.get<ProductsFacade>(ProductsFacade);
  });

  describe('올바른 상품 코드가 주어지면', () => {
    const productCode = faker.datatype.uuid();
    const mockedInfo = fixtureInfo();
    const expectedResult = {
      productInfo: mockedInfo,
    };

    it('등록된 상품 정보 응답', async () => {
      mockService.getOne.mockReturnValue(mockedInfo);

      expect(await facade.getOne(productCode)).toStrictEqual(expectedResult);
    });
  });
});

describe('updateProduct() 호출시', () => {
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsFacade,
        ProductsCommandMapper,
        { provide: 'ProductsService', useValue: mockService },
      ],
    }).compile();

    facade = module.get<ProductsFacade>(ProductsFacade);
  });

  describe('올바른 상품 정보가 주어지면', () => {
    function makeMockedInfo(command: {
      productCode: string;
      productName: string;
      productPrice: number;
    }) {
      const mockedInfo = fixtureInfo();
      mockedInfo.productCode = command.productCode;
      mockedInfo.productName = command.productName;
      mockedInfo.productPrice = command.productPrice;
      return mockedInfo;
    }

    it('수정된 상품 정보 응답', async () => {
      const command = fixtureUpdateProductCommand();
      const mockedInfo = makeMockedInfo(command);
      const expectedResult = {
        productInfo: mockedInfo,
      };

      mockService.updateProduct.mockReturnValue(mockedInfo);

      const res = await facade.updateProduct(command);

      expect(mockService.updateProduct).toHaveBeenCalledWith(command);
      expect(res.productInfo.productCode).toStrictEqual(command.productCode);
      expect(res.productInfo.productName).toStrictEqual(command.productName);
      expect(res.productInfo.productPrice).toStrictEqual(command.productPrice);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('updateProductOptionGroup() 호출시', () => {
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsFacade,
        ProductsCommandMapper,
        { provide: 'ProductsService', useValue: mockService },
      ],
    }).compile();

    facade = module.get<ProductsFacade>(ProductsFacade);
  });

  describe('올바른 옵션 그룹 정보가 주어지면', () => {
    function makeMockedInfo(command) {
      const mockedInfo = fixtureInfo();
      mockedInfo.productOptionGroupList.push({
        id: command.id,
        productOptionGroupName: command.productOptionGroupName,
        ordering: command.ordering,
        productOptionList: [
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 3,
          },
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 2,
          },
          {
            id: faker.datatype.number(),
            productOptionName: faker.commerce.color(),
            productOptionPrice: faker.commerce.price(),
            ordering: 1,
          },
        ],
      });
      return mockedInfo;
    }

    function getAssertOptionGroupName(res, command) {
      return res.productInfo.productOptionGroupList.find(
        value => value.id == command.id,
      ).productOptionGroupName;
    }

    function getAssertOptionGroupOrder(res, command) {
      return res.productInfo.productOptionGroupList.find(
        value => value.id == command.id,
      ).ordering;
    }

    it('수정된 상품 정보 응답', async () => {
      const command = fixtureUpdateProductOptionGroupCommand();
      const mockedInfo = makeMockedInfo(command);
      const expectedResult = {
        productInfo: mockedInfo,
      };

      mockService.updateProductOptionGroup.mockReturnValue(mockedInfo);

      const res = await facade.updateProductOptionGroup(command);

      expect(mockService.updateProductOptionGroup).toHaveBeenCalledWith(
        command,
      );
      expect(getAssertOptionGroupName(res, command)).toStrictEqual(
        command.productOptionGroupName,
      );
      expect(getAssertOptionGroupOrder(res, command)).toStrictEqual(
        command.ordering,
      );
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('updateProductOptionGroup() 호출시', () => {
  let facade: ProductsFacade;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsFacade,
        ProductsCommandMapper,
        { provide: 'ProductsService', useValue: mockService },
      ],
    }).compile();

    facade = module.get<ProductsFacade>(ProductsFacade);
  });

  describe('올바른 옵션 정보가 주어지면', () => {
    function makeMockedInfo(command) {
      const mockedInfo = fixtureInfo();
      mockedInfo.productOptionGroupList[0].id = command.id;
      mockedInfo.productOptionGroupList[0].productOptionList[0].productOptionName =
        command.productOptionName;
      mockedInfo.productOptionGroupList[0].productOptionList[0].productOptionPrice =
        command.productOptionPrice;
      mockedInfo.productOptionGroupList[0].productOptionList[0].ordering =
        command.ordering;

      return mockedInfo;
    }

    it('수정된 상품 정보 응답', async () => {
      const command = fixtureUpdateProductOptionCommand();
      const mockedInfo = makeMockedInfo(command);
      const expectedResult = {
        productInfo: mockedInfo,
      };

      mockService.updateProductOption.mockReturnValue(mockedInfo);

      const res = await facade.updateProductOption(command);
      expect(mockService.updateProductOption).toHaveBeenCalledWith(command);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});
