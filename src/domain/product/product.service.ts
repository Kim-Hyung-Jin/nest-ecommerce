import { Injectable } from '@nestjs/common';
import { ProductReader } from './product.reader';
import ProductStore from './product.store';
import {
  CreateProductCommand,
  UpdateProductCommand, UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../dto/product/product.command';
import { ProductCommandMapper } from './product.command.mapper';
import { ProductInfo } from '../dto/product/product.info';

export interface ProductService {
  register(command: CreateProductCommand): Promise<ProductInfo>;

  getOne(productCode: string): Promise<ProductInfo>;

  updateProduct(command: UpdateProductCommand): Promise<ProductInfo>;

  updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductInfo>;

  updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductInfo>;
}
