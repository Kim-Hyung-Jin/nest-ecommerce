import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from '../interfaces/products.controller';
import { ProductsFacade } from '../application/products.facade';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsFacade]
})
export class ProductsModule {}
