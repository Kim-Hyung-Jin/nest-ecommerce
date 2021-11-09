import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateProductDto } from '../interfaces/dto/update-product.dto';
import { ProductsReader } from './products.reader';
import ProductsStore from './products.store';
import { CreateProductCommand } from './dto/create-product.command';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsInfo } from './dto/products.info';
import { ProductsService } from './products.service';
import { logger } from '../common/logger';
import {
  UpdateProductCommand,
  UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from './dto/update-product.command';

@Injectable()
export class ProductsServiceImpl implements ProductsService {
  constructor(
    private productsCommandMapper: ProductsCommandMapper,
    @Inject('ProductsReader') private productReader: ProductsReader,
    @Inject('ProductsStore') private productStore: ProductsStore,
  ) {}

  async register(command: CreateProductCommand): Promise<ProductsInfo> {
    const initProduct = this.productsCommandMapper.toProductEntity(command);
    Logger.log('initProduct ->' + JSON.stringify(initProduct, null, 2));
    const product = await this.productStore.store(initProduct);
    const allOptionInfoList = this.productReader.getAllOptionInfoList(product);
    return this.productsCommandMapper.ofPaymentInfo(product, allOptionInfoList);
  }

  findAll() {
    return `This action returns all products`;
  }

  async getOne(productCode: string): Promise<ProductsInfo> {
    const product = await this.productReader.getProductBy(productCode);
    logger('product -> ', product);
    const allOptionInfoList = this.productReader.getAllOptionInfoList(product);
    logger('allOptionInfoList -> ', allOptionInfoList);
    return this.productsCommandMapper.ofPaymentInfo(product, allOptionInfoList);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateProduct(command: UpdateProductCommand): Promise<ProductsInfo> {
    const product = await this.productReader.getProductBy(command.productCode);
    product.updateProductInfo(command.productName, command.productPrice);
    const updatedProduct = await this.productStore.store(product);
    const allOptionInfoList =
      this.productReader.getAllOptionInfoList(updatedProduct);

    return this.productsCommandMapper.ofPaymentInfo(
      updatedProduct,
      allOptionInfoList,
    );
  }

  updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductsInfo> {
    return Promise.resolve(undefined);
  }

  updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductsInfo> {
    return Promise.resolve(undefined);
  }
}
