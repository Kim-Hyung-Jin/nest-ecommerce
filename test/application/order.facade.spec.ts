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
  fixtureProductOption,
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

    it('등록된 주문 정보 응답', async () => {
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

  describe('orderCode 가 정상적으로 주어지면', () => {
    const orderCode = faker.datatype.uuid();
    const mockedInfo = { orderCode: orderCode };
    const expectedResult = { orderInfo: mockedInfo };

    it('요청한 주문 정보 응답', async () => {
      mockService.get.mockReturnValue(mockedInfo);

      const res = await facade.get(orderCode);
      expect(mockService.get).toHaveBeenCalledWith(orderCode);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('cancel() 호출시', () => {
  let facade: OrderFacade;

  beforeEach(async () => {
    const module = await getTestModule();
    facade = module.get<OrderFacade>(OrderFacade);
  });

  describe('orderCode 가 정상적으로 주어지면', () => {
    const orderCode = faker.datatype.uuid();
    const mockedInfo = { orderCode: orderCode };
    const expectedResult = { orderInfo: mockedInfo };

    it('취소된 주문 정보 응답', async () => {
      mockService.cancel.mockReturnValue(mockedInfo);

      const res = await facade.cancel(orderCode);
      expect(mockService.cancel).toHaveBeenCalledWith(orderCode);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

describe('partCancel() 호출시', () => {
  let facade: OrderFacade;

  beforeEach(async () => {
    const module = await getTestModule();
    facade = module.get<OrderFacade>(OrderFacade);
  });

  describe('orderCode 와 취소할 주문 아이디가 정상적으로 주어지면', () => {
    const orderCode = faker.datatype.uuid();
    const cancelOrderLineIdList = [
      faker.datatype.number(),
      faker.datatype.number(),
      faker.datatype.number(),
    ];
    const mockedInfo = { orderCode: orderCode };
    const expectedResult = { orderInfo: mockedInfo };

    it('취소된 주문 정보 응답', async () => {
      mockService.partCancel.mockReturnValue(mockedInfo);

      const res = await facade.partCancel(orderCode, cancelOrderLineIdList);
      expect(mockService.partCancel).toHaveBeenCalledWith(
        orderCode,
        cancelOrderLineIdList,
      );
      expect(res).toStrictEqual(expectedResult);
    });
  });
});

function makeCreateOrderCommand() {
  return {
    userId: faker.datatype.number(),
    payMethod: faker.datatype.string(),
    address: makeCreateAddress(),
    orderLineList: [
      makeCreateOrderLine(),
      makeCreateOrderLine(),
      makeCreateOrderLine(),
    ],
  };
}

function makeCreateAddress() {
  return {
    receiverName: faker.commerce.productName(),
    receiverPhone: faker.datatype.number(),
    receiverZipcode: faker.address.countryCode(),
    receiverAddress1: faker.address.streetAddress(),
    receiverAddress2: faker.address.secondaryAddress(),
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
