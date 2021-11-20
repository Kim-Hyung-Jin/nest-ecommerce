import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import * as faker from 'faker';
import { ProductModule } from '../src/modules/product.module';
import { OrderModule } from '../src/modules/order.module';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLService } from '../src/config/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmService } from '../src/config/typeorm';
import { TypeormTestService } from '../src/config/typeorm/typeorm-test';

jest.setTimeout(30000);
describe('graphql (e2e)', () => {
  let app: INestApplication;

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
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/graphql', () => {
    describe('orders mutations 시', () => {
      const response = { orderCode: faker.datatype.uuid() };
      const query = `mutation($data: CreateOrder) {
                        create(dto: $data) {
                          userId
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
          .set('Accept', 'application/json')
          .type('application/json')
          .send({
            query: query,
            variables: {
              data: dto,
            },
          })
          .expect(res => {
            dto.orderLineList.map(orderLine => {
              Reflect.set(orderLine, 'status', '결제전');
            });
            expect(res.body.data).toStrictEqual({
              create: { ...dto },
            });
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
