import { Inject, Injectable } from '@nestjs/common';
import { CreateProductCommand } from '../domain/dto/create-product.command';
import { ProductsServiceImpl } from '../domain/products.service-impl';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { ProductsResult } from '../domain/products.result';
import { ProductsService } from '../domain/products.service';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../domain/dto/update-product.command';

@Injectable()
export default class ProductsFacade {
  constructor(
    private productsCommandMapper: ProductsCommandMapper,
    @Inject('ProductsService') private productsService: ProductsService,
  ) {}

  async register(command: CreateProductCommand): Promise<ProductsResult> {
    const productInfo = await this.productsService.register(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async getOne(productCode: string): Promise<ProductsResult> {
    const productInfo = await this.productsService.getOne(productCode);
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async updateProduct(command: UpdateProductCommand): Promise<ProductsResult> {
    const productInfo = await this.productsService.updateProduct(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductsResult> {
    const productInfo = await this.productsService.updateProductOptionGroup(
      command,
    );
    return this.productsCommandMapper.ofResult(productInfo);
  }

  async updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductsResult> {
    const productInfo = await this.productsService.updateProductOption(command);
    return this.productsCommandMapper.ofResult(productInfo);
  }
}
