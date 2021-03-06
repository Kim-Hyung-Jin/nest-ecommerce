import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProductReader } from './product.reader';
import ProductStore from './product.store';
import {
  CreateProductCommand,
  UpdateProductCommand, UpdateProductOptionCommand,
  UpdateProductOptionGroupCommand,
} from '../dto/product/product.command';
import { ProductCommandMapper } from './product.command.mapper';
import { ProductInfo } from '../dto/product/product.info';
import { ProductService } from './product.service';
import { logger } from '../../common/logger';
import { UpdateProductDto } from '../../interfaces/dto/product.dto';

@Injectable()
export class ProductServiceImpl implements ProductService {
  constructor(
    private productCommandMapper: ProductCommandMapper,
    @Inject('ProductReader') private productReader: ProductReader,
    @Inject('ProductStore') private productStore: ProductStore,
  ) {}

  async register(command: CreateProductCommand): Promise<ProductInfo> {
    const initProduct = this.productCommandMapper.toProductEntity(command);
    Logger.log('initProduct ->' + JSON.stringify(initProduct, null, 2));
    const product = await this.productStore.store(initProduct);
    const allOptionInfoList = this.productReader.getAllOptionInfoList(product);
    return this.productCommandMapper.ofPaymentInfo(product, allOptionInfoList);
  }

  findAll() {
    return `This action returns all products`;
  }

  async getOne(productCode: string): Promise<ProductInfo> {
    const product = await this.productReader.getProductBy(productCode);
    logger('product -> ', product);
    const allOptionInfoList = this.productReader.getAllOptionInfoList(product);
    logger('allOptionInfoList -> ', allOptionInfoList);
    return this.productCommandMapper.ofPaymentInfo(product, allOptionInfoList);
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async updateProduct(command: UpdateProductCommand): Promise<ProductInfo> {
    const product = await this.productReader.getProductBy(command.productCode);
    product.updateProduct(command.productName, command.productPrice);
    const updatedProduct = await this.productStore.store(product);
    const allOptionInfoList =
      this.productReader.getAllOptionInfoList(updatedProduct);

    return this.productCommandMapper.ofPaymentInfo(
      updatedProduct,
      allOptionInfoList,
    );
  }

  async updateProductOptionGroup(
    command: UpdateProductOptionGroupCommand,
  ): Promise<ProductInfo> {
    const product = await this.productReader.getProductBy(command.productCode);
    product.updateProductOptionGroup(
      // TODO ????????? ????????? ?????????
      command.id,
      command.productOptionGroupName,
      command.ordering,
    );
    const updatedProduct = await this.productStore.store(product);
    const allOptionInfoList =
      this.productReader.getAllOptionInfoList(updatedProduct);

    return this.productCommandMapper.ofPaymentInfo(
      updatedProduct,
      allOptionInfoList,
    );
  }

  async updateProductOption(
    command: UpdateProductOptionCommand,
  ): Promise<ProductInfo> {
    const product = await this.productReader.getProductBy(command.productCode);
    product.updateProductOption(
      command.optionGroupId,
      command.id,
      command.productOptionName,
      command.ordering,
      command.productOptionPrice,
    );
    const updatedProduct = await this.productStore.store(product);
    const allOptionInfoList =
      this.productReader.getAllOptionInfoList(updatedProduct);

    return this.productCommandMapper.ofPaymentInfo(
      updatedProduct,
      allOptionInfoList,
    );
  }
}
