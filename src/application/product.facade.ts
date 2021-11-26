import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProductCommand,
  UpdateProductCommand, UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../domain/dto/product/product.command';
import { ProductServiceImpl } from '../domain/product/product.service-impl';
import { ProductCommandMapper } from '../domain/product/product.command.mapper';
import { ProductResult } from '../domain/dto/product/product.result';
import { ProductService } from '../domain/product/product.service';

@Injectable()
export default class ProductFacade {
  constructor(
    private productCommandMapper: ProductCommandMapper,
    @Inject('ProductService') private productService: ProductService,
  ) {}

  async register(command: CreateProductCommand): Promise<ProductResult> {
    const productInfo = await this.productService.register(command);
    return this.productCommandMapper.ofResult(productInfo);
  }

  async getOne(productCode: string): Promise<ProductResult> {
    const productInfo = await this.productService.getOne(productCode);
    return this.productCommandMapper.ofResult(productInfo);
  }

  async updateProduct(command: UpdateProductCommand): Promise<ProductResult> {
    const productInfo = await this.productService.updateProduct(command);
    return this.productCommandMapper.ofResult(productInfo);
  }

  async updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductResult> {
    const productInfo = await this.productService.updateProductOptionGroup(
      command,
    );
    return this.productCommandMapper.ofResult(productInfo);
  }

  async updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductResult> {
    const productInfo = await this.productService.updateProductOption(command);
    return this.productCommandMapper.ofResult(productInfo);
  }
}
