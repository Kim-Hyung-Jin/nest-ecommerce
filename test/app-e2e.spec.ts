import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app.module';
import * as faker from 'faker';

const test = `{"userId":"M.6LYg-9w|","payMethod":"WIKOtGh2hs","address":{"receiverName":"Generic Metal Towels","receiverPhone":2139,"receiverZipcode":"YT","receiverAddress1":"463 Kerluke Avenue","receiverAddress2":"Suite 874"},"orderLineList":[{"ordering":4192,"productCode":"5TCkA<Q@0N","orderCount":20624,"productPrice":"524.00","productOptionGroupList":[{"productOptionGroupName":"Intelligent Fresh Bacon","ordering":58010,"productionOptionList":[{"productOptionPrice":"799.00","productOptionName":"Practical Steel Pizza","ordering":42067},{"productOptionPrice":"440.00","productOptionName":"Licensed Fresh Gloves","ordering":51370},{"productOptionPrice":"886.00","productOptionName":"Gorgeous Frozen Computer","ordering":1915}]},{"productOptionGroupName":"Unbranded Soft Computer","ordering":49092,"productionOptionList":[{"productOptionPrice":"245.00","productOptionName":"Sleek Cotton Sausages","ordering":64300},{"productOptionPrice":"631.00","productOptionName":"Generic Fresh Bacon","ordering":93722},{"productOptionPrice":"558.00","productOptionName":"Incredible Fresh Chicken","ordering":80438}]},{"productOptionGroupName":"Gorgeous Soft Ball","ordering":12721,"productionOptionList":[{"productOptionPrice":"706.00","productOptionName":"Generic Plastic Tuna","ordering":74685},{"productOptionPrice":"916.00","productOptionName":"Gorgeous Soft Hat","ordering":47214},{"productOptionPrice":"925.00","productOptionName":"Fantastic Frozen Car","ordering":81059}]}]},{"ordering":95437,"productCode":"%fU\\")Qw\\"::","orderCount":10685,"productPrice":"357.00","productOptionGroupList":[{"productOptionGroupName":"Intelligent Wooden Keyboard","ordering":59038,"productionOptionList":[{"productOptionPrice":"719.00","productOptionName":"Handmade Steel Shoes","ordering":51213},{"productOptionPrice":"6.00","productOptionName":"Incredible Granite Shirt","ordering":9154},{"productOptionPrice":"706.00","productOptionName":"Intelligent Granite Gloves","ordering":6892}]},{"productOptionGroupName":"Sleek Wooden Table","ordering":32701,"productionOptionList":[{"productOptionPrice":"163.00","productOptionName":"Tasty Concrete Chair","ordering":46937},{"productOptionPrice":"353.00","productOptionName":"Handmade Wooden Chair","ordering":91583},{"productOptionPrice":"322.00","productOptionName":"Generic Steel Bacon","ordering":679}]},{"productOptionGroupName":"Practical Fresh Pants","ordering":29229,"productionOptionList":[{"productOptionPrice":"447.00","productOptionName":"Intelligent Steel Chair","ordering":35996},{"productOptionPrice":"62.00","productOptionName":"Practical Plastic Soap","ordering":50833},{"productOptionPrice":"948.00","productOptionName":"Refined Fresh Computer","ordering":58508}]}]},{"ordering":35333,"productCode":"931/!|n?Z?","orderCount":31614,"productPrice":"205.00","productOptionGroupList":[{"productOptionGroupName":"Fantastic Metal Keyboard","ordering":91065,"productionOptionList":[{"productOptionPrice":"692.00","productOptionName":"Sleek Fresh Pizza","ordering":12880},{"productOptionPrice":"508.00","productOptionName":"Practical Metal Sausages","ordering":54341},{"productOptionPrice":"416.00","productOptionName":"Generic Concrete Computer","ordering":65749}]},{"productOptionGroupName":"Fantastic Steel Fish","ordering":66047,"productionOptionList":[{"productOptionPrice":"153.00","productOptionName":"Unbranded Cotton Fish","ordering":85208},{"productOptionPrice":"275.00","productOptionName":"Practical Rubber Salad","ordering":94009},{"productOptionPrice":"665.00","productOptionName":"Small Soft Chicken","ordering":72392}]},{"productOptionGroupName":"Unbranded Concrete Towels","ordering":3301,"productionOptionList":[{"productOptionPrice":"387.00","productOptionName":"Unbranded Concrete Bike","ordering":20427},{"productOptionPrice":"897.00","productOptionName":"Awesome Soft Cheese","ordering":23893},{"productOptionPrice":"686.00","productOptionName":"Refined Granite Cheese","ordering":24716}]}]}]}`;

jest.setTimeout(30000);
describe('graphql (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/graphql', () => {
    describe('orders mutations 시', () => {
      const response = { orderCode: faker.datatype.uuid() };
      it('생성된 주문의 정보 응답', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({
            query: `mutation {create(dto: ${makeCreateOrderRequest()}) {userId orderCode payMethod orderAddress orderLineList}}`,
          })
          .expect(res => {
            console.log('####' + JSON.stringify(makeCreateOrderRequest()));
            console.log(
              '####2' +
                `mutation {create(dto: ${test}) {userId orderCode payMethod orderAddress orderLineList}}`,
            );
            expect(res.body).toStrictEqual('res');
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
