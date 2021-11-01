import { Inject, Injectable, Logger } from '@nestjs/common';
import { UpdateProductDto } from '../interfaces/dto/update-product.dto';
import { ProductsReader } from './products.reader';
import ProductsStore from './products.store';
import { CreateProductCommand } from './dto/create-product.command';
import { ProductsCommandMapper } from './products.command.mapper';
import { ProductsInfo } from './dto/products.info';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsServiceImpl implements ProductsService {
  constructor(
    private productsCommandMapper: ProductsCommandMapper,
    @Inject('ProductsReader') private productReader: ProductsReader,
    @Inject('ProductsStore') private productStore: ProductsStore,
  ) {}

  async create(command: CreateProductCommand): Promise<ProductsInfo> {
    const initProduct = this.productsCommandMapper.toProductEntity(command);
    Logger.log('initProduct ->' + JSON.stringify(initProduct, null, 2));
    const product = await this.productStore.store(initProduct);
    const productOptionGroupInfoList =
      this.productReader.getProductOptionGroupInfoList(product);
    return this.productsCommandMapper.ofPaymentInfo(
      product,
      productOptionGroupInfoList,
    );
  }

  findAll() {
    return `This action returns all products`;
  }

  async findOne(productCode: string): Promise<ProductsInfo> {
    const product = await this.productReader.getProductByCode(productCode);
    Logger.log('product -> ' + JSON.stringify(product, null, 2));
    const productionOptionGroupList =
      this.productReader.getProductOptionGroupInfoList(product);
    Logger.log(
      'product -> ' + JSON.stringify(productionOptionGroupList, null, 2),
    );
    return this.productsCommandMapper.ofPaymentInfo(
      product,
      productionOptionGroupList,
    );
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
