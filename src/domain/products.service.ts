import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from '../interfaces/dto/update-product.dto';
import { ProductsReader } from './products.reader';
import ProductsStore from './products.store';
import { CreateProductCommand } from './dto/create-product.command';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsInfo } from './dto/products.info';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from './dto/update-product.command';

export interface ProductsService {
  register(command: CreateProductCommand): Promise<ProductsInfo>;

  getOne(productCode: string): Promise<ProductsInfo>;

  updateProduct(command: UpdateProductCommand): Promise<ProductsInfo>;

  updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductsInfo>;

  updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductsInfo>;
}
