import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from '../../interfaces/dto/product/update-product.dto';
import { ProductReader } from './product.reader';
import ProductStore from './product.store';
import { CreateProductCommand } from '../dto/product/product.command';
import { ProductCommandMapper } from './product.command.mapper';
import { ProductInfo } from '../dto/product/product.info';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from './dto/update-product.command';

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
