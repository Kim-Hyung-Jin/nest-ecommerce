import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import * as faker from 'faker';
import { ProductModule } from '../src/modules/product.module';
import { OrderModule } from '../src/modules/order.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLService } from '../src/config/graphql';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from '../src/config/typeorm';
import { TypeormTestService } from '../src/config/typeorm/typeorm-test';
import { OrderPersist } from '../src/domain/entity/order/persist/order.persist';
import { getRepository, Repository } from 'typeorm';
import { CreateOrder } from '../src/domain/dto/order/order.command';
import { cloneDeep } from 'lodash';
import {
  OrderLinePersist,
  OrderStatus,
} from '../src/domain/entity/order/persist/order-line.entity';
import { OrderAddressPersist } from '../src/domain/entity/order/persist/order.address.persist';
import { OrderProductOptionGroupPersist } from '../src/domain/entity/order/persist/order-product-option-group.persist';
import { OrderProductOptionPersist } from '../src/domain/entity/order/persist/order-product-option.persist';

jest.setTimeout(30000);
describe('graphql (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<OrderPersist>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProductModule,
        OrderModule,
        GraphQLModule.forRootAsync({
          useClass: GraphQLService,
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeormTestService,
        }),
      ],
      providers: [{ provide: getRepositoryToken(OrderPersist), useClass: Repository }],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = getRepository(OrderPersist);
    await app.init();
  });

  describe('/graphql', () => {
    describe('orders mutations 시', () => {
      const query = `mutation($data: CreateOrder) {
                        create(dto: $data) {
                          userId
                          orderCode
                          payMethod
                          address  {
                              receiverName
                              receiverPhone
                              receiverZipcode
                              receiverAddress1
                              receiverAddress2
                          }
                          orderLineList {
                              ordering
                              productCode
                              orderCount
                              productPrice
                              status
                              productOptionGroupList {
                                  productOptionGroupName
                                  ordering
                                  productionOptionList {
                                    productOptionPrice
                                    productOptionName
                                    ordering
                                  }
                              }
                          }
                        }
                      }
                      `;
      it('생성된 주문의 정보 응답', () => {
        const dto = makeCreateOrderRequest();
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: query,
            variables: {
              data: dto,
            },
          })
          .expect(res => {
            const testOrderCode = res.body.data.create.orderCode;
            const expectOrderCreateResult = makeOrderCreateResult(
              dto,
              testOrderCode,
            );
            repository
              .findOne(
                {
                  orderCode: testOrderCode,
                },
                {
                  relations: [
                    'address',
                    'orderLineList',
                    'orderLineList.productOptionGroupList',
                    'orderLineList.productOptionGroupList.productionOptionList',
                  ],
                },
              )
              .then(order => {
                assertCreateOrder(order, dto, testOrderCode);
              });

            expect(res.body.data).toStrictEqual({
              create: { ...expectOrderCreateResult },
            });
          });
      });

      describe('cancel mutations 시', () => {
        const query = `mutation($data: CancelOrder) {
                      cancel(dto: $data) {
                        userId
                        orderCode
                        payMethod
                        address  {
                            receiverName
                            receiverPhone
                            receiverZipcode
                            receiverAddress1
                            receiverAddress2
                        }
                        orderLineList {
                            ordering
                            productCode
                            orderCount
                            productPrice
                            status
                            productOptionGroupList {
                                productOptionGroupName
                                ordering
                                productionOptionList {
                                  productOptionPrice
                                  productOptionName
                                  ordering
                                }
                            }
                        }
                      }
                    }
                    `;
        it('생성된 주문의 정보 응답', async () => {
          const initOrder = makeOrder();
          const order = await repository.save(initOrder);

          return request(app.getHttpServer())
            .post('/graphql')
            .send({
              query: query,
              variables: {
                data: {
                  orderCode: order.orderCode,
                },
              },
            })
            .expect(res => {
              expect(res.body);
              console.log('111111 -> ' + res.text);
            });
        });
      });
    });
  });

  function makeCreateOrderRequest() {
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
      receiverPhone: faker.datatype.string(),
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
      productPrice: faker.datatype.number(),
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
      productOptionPrice: faker.datatype.number(),
      productOptionName: faker.commerce.productName(),
      ordering: faker.datatype.number(),
    };
  }

  function makeOrderCreateResult(dto, orderCode) {
    const result = Object.assign({}, dto);
    result.orderLineList.map(orderLine => {
      Reflect.set(orderLine, 'status', '결제전');
    });
    Reflect.set(result, 'orderCode', orderCode);
    return result;
  }

  function assertCreateOrder(order, dto, orderCode) {
    expect(order.userId).toStrictEqual(dto.userId);
    expect(order.payMethod).toStrictEqual(dto.payMethod);
    expect(order.orderCode).toStrictEqual(orderCode);
    expect(order.address.receiverName).toStrictEqual(dto.address.receiverName);
    expect(order.address.receiverPhone).toStrictEqual(
      dto.address.receiverPhone,
    );
    expect(order.address.receiverZipcode).toStrictEqual(
      dto.address.receiverZipcode,
    );
    expect(order.address.receiverAddress1).toStrictEqual(
      dto.address.receiverAddress1,
    );
    expect(order.address.receiverAddress2).toStrictEqual(
      dto.address.receiverAddress2,
    );
    order.orderLineList.map((orderLine, i) => {
      expect(orderLine.ordering).toStrictEqual(dto.orderLineList[i].ordering);
      expect(orderLine.productCode).toStrictEqual(
        dto.orderLineList[i].productCode,
      );
      expect(orderLine.orderCount).toStrictEqual(
        dto.orderLineList[i].orderCount,
      );
      expect(orderLine.productPrice).toStrictEqual(
        dto.orderLineList[i].productPrice,
      );
      expect(orderLine.status).toStrictEqual('결제전');
      orderLine.productOptionGroupList.map((productOptionGroup, j) => {
        const testTarget = dto.orderLineList[i].productOptionGroupList.find(
          value => productOptionGroup.ordering == value.ordering,
        );

        expect(productOptionGroup.productOptionGroupName).toStrictEqual(
          testTarget.productOptionGroupName,
        );
        testTarget.productionOptionList.find(value => {
          productOptionGroup.productionOptionList.map(a => {
            if (a.ordering == value.ordering) {
              expect(a.productOptionPrice).toStrictEqual(
                value.productOptionPrice,
              );
              expect(a.productOptionName).toStrictEqual(
                value.productOptionName,
              );
            }
          });
        });
      });
    });
  }
});

function makeOrder() {
  const order = new OrderPersist(
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

  return order;
}

function makeOrderAddress() {
  return new OrderAddressPersist(
    faker.commerce.productName(),
    faker.datatype.number(),
    faker.address.countryCode(),
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
  );
}

function makeOrderLineList() {
  return new OrderLinePersist(
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

function makeOrderLineMap(order: OrderPersist) {
  const orderLineMap = new Map();
  order.orderLineList.map(orderLine => {
    return orderLineMap.set(orderLine.id, orderLine);
  });
  return orderLineMap;
}

function makePartCancelOrder(entity: OrderPersist, cancelIdList: number[]) {
  const expectedCancelEntity = cloneDeep(entity); //TODO depp copy인가
  const orderLineMap = makeOrderLineMap(expectedCancelEntity);
  cancelIdList.map(cancelOrderLineId => {
    const orderLine: OrderLinePersist = orderLineMap.get(cancelOrderLineId);
    Reflect.set(orderLine, 'status', OrderStatus.CANCEL);
  });
  return expectedCancelEntity;
}

function makeOrderProductOptionGroup() {
  return new OrderProductOptionGroupPersist(
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
  return new OrderProductOptionPersist(
    faker.datatype.number(),
    faker.commerce.price(),
    faker.datatype.number(),
  );
}
