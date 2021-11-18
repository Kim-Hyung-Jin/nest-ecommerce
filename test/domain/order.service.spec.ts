import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/domain/product.service';
import { ProductCommandMapper } from '../../src/domain/product.command.mapper';
import { ProductServiceImpl } from '../../src/domain/product.service-impl';
import * as faker from 'faker';
import * as uuid from 'uuid';
import { Product } from '../../src/domain/entity/product.entity';
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
import { ProductInfo } from '../../src/domain/dto/product.info';
import OrderCommandMapper from '../../src/domain/order-command.mapper';
import OrderServiceImpl from '../../src/domain/order.service-impl';
import OrderService from '../../src/domain/order.service';
import {
  CreateAddress,
  CreateOrder,
  CreateOrderLine,
  CreateOrderProductOption,
  CreateOrderProductOptionGroup,
} from '../../src/domain/dto/order.command';
import { Order } from '../../src/domain/entity/order.entity';
import { OrderAddress } from '../../src/domain/entity/order-address';
import {
  OrderLine,
  OrderStatus,
} from '../../src/domain/entity/order-line.entity';
import { OrderProductOptionGroup } from '../../src/domain/entity/order-product-option-group.entity';
import { OrderProductOption } from '../../src/domain/entity/order-product-option.entity';

jest.mock('uuid');

const mockReader = {
  getOrder: jest.fn(),
};

const mockStore = {
  store: jest.fn(),
};

const testProvider = [
  OrderCommandMapper,
  { provide: 'OrderService', useClass: OrderServiceImpl },
  { provide: 'OrderStore', useValue: mockStore },
  { provide: 'OrderReader', useValue: mockReader },
];

async function getTestModule() {
  return await Test.createTestingModule({
    providers: testProvider,
  }).compile();
}

describe('create() 호출시', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<OrderService>('OrderService');
  });

  describe('배송중 이거나 배송 완료상태가 아닐때 OrderCommand.CreateOrder 가 주어지면', () => {
    it('주문 정보 응답', async () => {
      const command = makeCreateOrderCommand();
      const expectedEntity = makeEntity(command);

      const mockEntity = expectedEntity;
      const mockInfo = { ...mockEntity };

      mockStore.store.mockReturnValue(mockEntity);

      const res = await service.create(command);
      expect(mockStore.store).toHaveBeenCalledWith(expectedEntity);
      expect(res).toStrictEqual(mockInfo);
    });
  });
});

describe('get() 호출시', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<OrderService>('OrderService');
  });

  describe('orderCode 가 주어지면', () => {
    it('해당 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockInfo = { orderCode: faker.datatype.uuid() };

      mockReader.getOrder.mockReturnValue(mockInfo);

      const res = await service.get(orderCode);
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
      expect(res).toStrictEqual(mockInfo);
    });
  });
});

describe('cancel() 호출시', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<OrderService>('OrderService');
  });

  describe('orderCode 가 주어지면', () => {
    it('취소된 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockRetrieveEntity = makeEntity(undefined);
      Reflect.set(mockRetrieveEntity, 'orderCode', orderCode);
      const expectedCancelEntity = cloneDeep(mockRetrieveEntity);
      expectedCancelEntity.orderLineList.map(orderLine => {
        Reflect.set(orderLine, 'status', OrderStatus.CANCEL);
      });
      const mockInfo = { ...expectedCancelEntity };
      const mockedStoredCancelEntity = expectedCancelEntity;

      mockReader.getOrder.mockReturnValue(mockRetrieveEntity);
      mockStore.store.mockReturnValue(mockedStoredCancelEntity);

      const res = await service.cancel(orderCode);
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
      expect(mockStore.store).toHaveBeenCalledWith(expectedCancelEntity);
      expect(res).toStrictEqual(mockInfo);
    });
  });

  describe('배송중 상태일 때', () => {
    it('취소된 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockRetrieveEntity = makeEntity(undefined);
      Reflect.set(mockRetrieveEntity, 'orderCode', orderCode);
      mockRetrieveEntity.orderLineList.map(orderLine => {
        Reflect.set(orderLine, 'status', OrderStatus.SHIPPING);
      });

      mockReader.getOrder.mockReturnValue(mockRetrieveEntity);

      await expect(async () => {
        await service.cancel(orderCode);
      }).rejects.toThrowError(new Error('주문 취소 불가 상태'));
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
    });
  });

  describe('배송완료 상태일 때', () => {
    it('취소된 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockRetrieveEntity = makeEntity(undefined);
      mockRetrieveEntity.orderLineList.map(orderLine => {
        Reflect.set(orderLine, 'status', OrderStatus.DELIVERED);
      });

      mockReader.getOrder.mockReturnValue(mockRetrieveEntity);

      await expect(async () => {
        await service.cancel(orderCode);
      }).rejects.toThrowError(new Error('주문 취소 불가 상태'));
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
    });
  });

  describe('이미 취소된 상태일 때', () => {
    it('취소된 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockRetrieveEntity = makeEntity(undefined);
      mockRetrieveEntity.orderLineList.map(orderLine => {
        Reflect.set(orderLine, 'status', OrderStatus.CANCEL);
      });

      mockReader.getOrder.mockReturnValue(mockRetrieveEntity);

      await expect(async () => {
        await service.cancel(orderCode);
      }).rejects.toThrowError(new Error('주문 취소 불가 상태'));
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
    });
  });
});

describe('partCancel() 호출시', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module = await getTestModule();
    service = module.get<OrderService>('OrderService');
  });

  describe('orderCode, cancelOrderLineIdList 가 주어지면', () => {
    it('해당 주문 정보 응답', async () => {
      const orderCode = faker.datatype.uuid();
      const mockRetrieveEntity = makeEntity(undefined);
      mockRetrieveEntity.orderLineList.map(orderLine => {
        Reflect.set(orderLine, 'id', faker.datatype.number());
      });

      const cancelOrderLineIdList = [
        mockRetrieveEntity.orderLineList[0].id,
        mockRetrieveEntity.orderLineList[1].id,
      ];
      const expectedCancelEntity = cloneDeep(mockRetrieveEntity); //TODO depp copy인가

      const orderLineMap = makeOrderLineMap(expectedCancelEntity);
      cancelOrderLineIdList.map(cancelOrderLineId => {
        const orderLine: OrderLine = orderLineMap.get(cancelOrderLineId);
        Reflect.set(orderLine, 'status', OrderStatus.CANCEL);
      });

      const mockedStoredCancelEntity = Object.assign({}, expectedCancelEntity);
      const mockInfo = { ...mockedStoredCancelEntity };

      mockReader.getOrder.mockReturnValue(mockRetrieveEntity);
      mockStore.store.mockReturnValue(mockedStoredCancelEntity);

      const res = await service.partCancel(orderCode, cancelOrderLineIdList);
      expect(mockReader.getOrder).toHaveBeenCalledWith(orderCode);
      expect(mockStore.store).toHaveBeenCalledWith(expectedCancelEntity);
      expect(res).toStrictEqual(mockInfo);
    });
  });
});

function makeCreateOrderCommand() {
  return {
    userId: faker.datatype.string(),
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

function makeOrderBy(command: CreateOrder) {
  return new Order(
    command.userId,
    command.payMethod,
    makeOrderAddressBy(command.address),
    command.orderLineList.map(value => makeOrderLineListBy(value)),
  );
}

function makeOrderAddressBy(command: CreateAddress): OrderAddress {
  return new OrderAddress(
    command.receiverName,
    command.receiverPhone,
    command.receiverZipcode,
    command.receiverAddress1,
    command.receiverAddress2,
  );
}

function makeOrderLineListBy(command: CreateOrderLine): OrderLine {
  return new OrderLine(
    command.ordering,
    command.productCode,
    command.orderCount,
    command.productPrice,
    command.productOptionGroupList.map(value => {
      return makeOrderProductOptionGroupBy(value);
    }),
  );
}

function makeOrderProductOptionGroupBy(
  command: CreateOrderProductOptionGroup,
): OrderProductOptionGroup {
  return new OrderProductOptionGroup(
    command.productOptionGroupName,
    command.ordering,
    command.productionOptionList.map(value1 =>
      makeOrderProductOptionBy(value1),
    ),
  );
}

function makeOrderProductOptionBy(
  command: CreateOrderProductOption,
): OrderProductOption {
  return new OrderProductOption(
    command.productOptionPrice,
    command.productOptionName,
    command.ordering,
  );
}

function makeOrder() {
  return new Order(
    faker.datatype.string(),
    faker.datatype.string(),
    makeOrderAddress(),
    [
      makeOrderLineList(),
      makeOrderLineList(),
      makeOrderLineList(),
      makeOrderLineList(),
    ],
  );
}

function makeOrderAddress() {
  return new OrderAddress(
    faker.commerce.productName(),
    faker.datatype.number(),
    faker.address.countryCode(),
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
  );
}

function makeOrderLineList() {
  return new OrderLine(
    faker.datatype.number(),
    faker.datatype.string(),
    faker.datatype.number(),
    faker.commerce.price(),
    [
      makeOrderProductOptionGroup(),
      makeOrderProductOptionGroup(),
      makeOrderProductOptionGroup(),
    ],
  );
}

function makeOrderProductOptionGroup() {
  return new OrderProductOptionGroup(
    faker.commerce.productName(),
    faker.datatype.number(),
    [
      makeOrderProductOption(),
      makeOrderProductOption(),
      makeOrderProductOption(),
    ],
  );
}

function makeOrderProductOption() {
  return new OrderProductOption(
    faker.commerce.color(),
    faker.commerce.price(),
    faker.datatype.number(),
  );
}

function makeEntity(command: CreateOrder) {
  if (command == undefined) {
    return makeOrder();
  }

  return makeOrderBy(command);
}

function makeOrderLineMap(order: Order) {
  const orderLineMap = new Map();
  order.orderLineList.map(orderLine => {
    return orderLineMap.set(orderLine.id, orderLine);
  });
  return orderLineMap;
}
