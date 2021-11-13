import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';
import { ProductResolver } from '../../src/interfaces/graphql/productResolver';
import { ProductDtoMapper } from '../../src/interfaces/product-dto.mapper';
import { fixtureInfo } from '../fixture';
import ProductFacade from '../../src/application/product.facade';
import { ProductCommandMapper } from '../../src/domain/product.command.mapper';
import { IsNumber } from 'class-validator';
import OrderFacade from '../../src/application/order.facade';
import { OrderResolver } from '../../src/interfaces/graphql/order.resolver';
import {
  CreateOrder,
  CreateOrderLine,
} from '../../src/interfaces/dto/order/order-dto';

const mockFacade = {
  create: jest.fn(),
};

async function getTestModule() {
  return await Test.createTestingModule({
    providers: [{ provide: OrderFacade, useValue: mockFacade }, OrderResolver],
  }).compile();
}

describe('create() Mutation 호출시', () => {
  let resolver: OrderResolver;

  beforeEach(async () => {
    const module = await getTestModule();
    resolver = module.get<OrderResolver>(OrderResolver);
  });

  describe('올바른 주문정보가 주어졌으면', () => {
    it('조회한 상품 정보 응답', async () => {
      const request = makeCreateOrderRequest();
      const command = { ...request };
      const mockedResult = { orderInfo: { orderCode: faker.datatype.uuid() } };
      const expectedResponse = { orderCode: mockedResult.orderInfo.orderCode };
      mockFacade.create.mockReturnValue(mockedResult);

      const res = await resolver.create(request);
      expect(mockFacade.create).toHaveBeenCalledWith(command);
      expect(res).toStrictEqual(expectedResponse);
    });
  });
});

function makeCreateOrderRequest() {
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
