import { Test, TestingModule } from '@nestjs/testing';
import ProductsFacade from '../../src/application/products.facade';
import * as faker from 'faker';
import { ProductsCommandMapper } from '../../src/domain/products.command.mapper';
import { MockType } from '../../src/common/mock.helper';
import { ProductsService } from '../../src/domain/products.service';
import { ProductsServiceImpl } from '../../src/domain/products.service-impl';
import {
  fixtureCreateProductCommand,
  fixtureProduct,
  fixtureProductInfo,
} from '../fixture';

const mockService = {
  register: jest.fn(),
  getOne: jest.fn(),
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
    const command = fixtureCreateProductCommand();
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
    const mockedInfo = fixtureProductInfo();
    const expectedResult = {
      productInfo: mockedInfo,
    };

    it('등록된 상품 정보 응답', async () => {
      mockService.getOne.mockReturnValue(mockedInfo);
      const res = await facade.getOne(productCode);
      expect(res).toStrictEqual(expectedResult);
    });
  });
});
