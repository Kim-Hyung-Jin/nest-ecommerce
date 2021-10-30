import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateProductDto } from '../interfaces/dto/update-product.dto';
import { ProductsReader } from './products.reader';
import ProductsStore from './products.store';
import { CreateProductCommand } from './dto/create-product.command';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsInfo } from './dto/products.info';
import { ProductsService } from './products.service';
import { logger } from '../common/logger';

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
    const product = await this.productReader.getByProductCode(productCode);
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
}
