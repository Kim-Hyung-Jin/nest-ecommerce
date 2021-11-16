import { Test, TestingModule } from '@nestjs/testing';
import ProductFacade from '../../src/application/product.facade';
import * as faker from 'faker';
import { ProductCommandMapper } from '../../src/domain/product.command.mapper';
import { MockType } from '../../src/common/mock.helper';
import { ProductService } from '../../src/domain/product.service';
import { ProductServiceImpl } from '../../src/domain/product.service-impl';
import {
  fixtureCreateCommand,
  fixtureInfo,
  fixtureProduct,
  fixtureUpdateProductCommand,
  fixtureUpdateProductOptionCommand,
  fixtureUpdateProductOptionGroupCommand,
} from '../fixture';
import OrderFacade from '../../src/application/order.facade';

const mockService = {
  create: jest.fn(),
  get: jest.fn(),
  cancel: jest.fn(),
  partCancel: jest.fn(),
};

async function getTestModule() {
  return await Test.createTestingModule({
    providers: [
      OrderFacade,
      { provide: 'ProductService', useValue: mockService },
    ],
  }).compile();
}

describe('create() 호출시', () => {
  let facade: OrderFacade;

  beforeEach(async () => {
    const module = await getTestModule();
    facade = module.get<OrderFacade>(OrderFacade);
  });

  describe('정상적인 command 가 주어졌으면', () => {
    const command = makeCreateOrderCommand();
    const mockedInfo = { orderCode: faker.datatype.uuid() };
    const expectedResult = { orderInfo: mockedInfo };

    it('등록된 상품 정보 응답', async () => {
      mockService.create.mockReturnValue(mockedInfo);

      const res = await facade.create(command);
      expect(mockService.create).toHaveBeenCalledWith(command);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('get() 호출시', () => {
  let facade: OrderFacade;

  beforeEach(async () => {
    const module = await getTestModule();
    facade = module.get<OrderFacade>(OrderFacade);
  });

  describe('정상적인 command 가 주어졌으면', () => {
    const command = makeCreateOrderCommand();
    const mockedInfo = { orderCode: faker.datatype.uuid() };
    const expectedResult = { orderInfo: mockedInfo };

    it('등록된 상품 정보 응답', async () => {
      mockService.create.mockReturnValue(mockedInfo);

      const res = await facade.create(command);
      expect(mockService.create).toHaveBeenCalledWith(command);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

function makeCreateOrderCommand() {
  return {
    userId: faker.datatype.number(),
    payMethod: faker.datatype.string(),
    receiverName: faker.commerce.productName(),
    receiverPhone: faker.datatype.number(),
    receiverZipcode: faker.address.countryCode(),
    receiverAddress1: faker.address.streetAddress(),
    receiverAddress2: faker.address.secondaryAddress(),
    orderLineList: [
      makeCreateOrderLine(),
      makeCreateOrderLine(),
      makeCreateOrderLine(),
    ],
  };
}

function makeCreateOrderLine() {
  return {
    ordering: faker.datatype.number(),
    productCode: faker.datatype.string(),
    orderCount: faker.datatype.number(),
    productPrice: faker.commerce.price(),
    productOptionGroupList: [
      makeProductOptionGroup(),
      makeProductOptionGroup(),
      makeProductOptionGroup(),
    ],
  };
}

function makeProductOptionGroup() {
  return {
    productOptionGroupName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
    productionOptionList: [
      makeProductOption(),
      makeProductOption(),
      makeProductOption(),
    ],
  };
}

function makeProductOption() {
  return {
    productOptionPrice: faker.commerce.price(),
    productOptionName: faker.commerce.productName(),
    ordering: faker.datatype.number(),
  };
}
