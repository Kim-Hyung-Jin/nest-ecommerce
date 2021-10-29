// import { Test, TestingModule } from '@nestjs/testing';
// import { ProductsController } from './products.controller';
// import { ProductsFacade } from '../application/products.facade';
//
// describe('ProductsController', () => {
//   let controller: ProductsController;
//   let facade: ProductsFacade;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [ProductsController],
//       providers: [ProductsFacade],
//     }).compile();
//
//     controller = module.get<ProductsController>(ProductsController);
//     facade = module.get<ProductsFacade>(ProductsFacade);
//   });
//
//   describe('상품 등록 요청시', () => {
//     it('should be defined', () => {
//       jest.spyOn(facade, 'registerProduct').mockImplementation(() => 'tt3');
//       // expect(controller.create()).toBeDefined();
//       expect(controller.create()).toBe('tt3');
//     });
//   });
//
// });
