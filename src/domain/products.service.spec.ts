import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsServiceImpl } from './products.service-impl';
import * as faker from 'faker';

const mockReader = {
  getByProductCode: jest.fn(),
  getProductOptionGroupInfoList: jest.fn(),
};

const mockStore = {
  store: jest.fn(),
};

describe('register() 호출시', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // ProductsServiceImpl,
        { provide: 'test', useValue: ProductsServiceImpl }, // TODO 왜 프로바이드를 바꾸면 안되는지 확인
        ProductsCommandMapper,
        { provide: 'ProductsReader', useValue: mockReader },
        { provide: 'ProductsStore', useValue: mockStore },
      ],
    }).compile();

    service = module.get<ProductsServiceImpl>('test');
  });

  describe('올바른 데이터가 주어지면', () => {
    const command = {
      productName: faker.commerce.productName(),
      productPrice: faker.commerce.price(),
      productCode: faker.datatype.uuid(),
      productOptionGroupList: [
        {
          productOptionGroupName: faker.commerce.productName(),
          ordering: 1,
          productOptionList: [
            {
              productOptionName: faker.commerce.color(),
              productOptionPrice: faker.commerce.price(),
              ordering: 3,
            },
            {
              productOptionName: faker.commerce.color(),
              productOptionPrice: faker.commerce.price(),
              ordering: 2,
            },
            {
              productOptionName: faker.commerce.color(),
              productOptionPrice: faker.commerce.price(),
              ordering: 1,
            },
          ],
        },
        {
          productOptionGroupName: faker.commerce.productName(),
          ordering: 2,
          productOptionList: [
            {
              productOptionName: faker.commerce.color(),
              productOptionPrice: faker.commerce.price(),
              ordering: 2,
            },
            {
              productOptionName: faker.commerce.color(),
              productOptionPrice: faker.commerce.price(),
              ordering: 1,
            },
          ],
        },
      ],
    };
    console.log('@@@@@@@ -> ' + service);
    it('should be defined', async () => {
      const res = await service.register(command);
    });
  });
});

//
//
// const command = {
//   productName: faker.commerce.productName(),
//   productPrice: faker.commerce.price(),
//   productCode: faker.datatype.uuid(),
//   productOptionGroupList: [
//     {
//       productOptionGroupName: faker.commerce.productName(),
//       ordering: 1,
//       productOptionList: [
//         {
//           productOptionName: faker.commerce.color(),
//           productOptionPrice: faker.commerce.price(),
//           ordering: 3,
//         },
//         {
//           productOptionName: faker.commerce.color(),
//           productOptionPrice: faker.commerce.price(),
//           ordering: 2,
//         },
//         {
//           productOptionName: faker.commerce.color(),
//           productOptionPrice: faker.commerce.price(),
//           ordering: 1,
//         },
//       ],
//     },
//     {
//       productOptionGroupName: faker.commerce.productName(),
//       ordering: 2,
//       productOptionList: [
//         {
//           productOptionName: faker.commerce.color(),
//           productOptionPrice: faker.commerce.price(),
//           ordering: 2,
//         },
//         {
//           productOptionName: faker.commerce.color(),
//           productOptionPrice: faker.commerce.price(),
//           ordering: 1,
//         },
//       ],
//     },
//   ],
// };
//
// const mockedEntity = {
//   productName: command.productName,
//   productPrice: command.productPrice,
//   productCode: command.productCode,
//   productOptionGroupList: command.productOptionGroupList,
// };
//
// const expectedInfo = {
//   productName: mockedEntity.productName,
//   productPrice: mockedEntity.productPrice,
//   productCode: mockedEntity.productCode,
//   productOptionGroupList: mockedEntity,
// };
