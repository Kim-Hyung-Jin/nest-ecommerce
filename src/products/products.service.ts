import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsReader } from '../domain/products.reader';
import ProductsStore from '../domain/products.store';
import { CreateProductCommand } from './dto/create-product.command';
import { ProductsCommandMapper } from '../domain/products.command.mapper';
import { ProductsInfo } from '../domain/products.info';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productReader: ProductsReader,
    private readonly productStore: ProductsStore,
    private readonly productsCommandMapper: ProductsCommandMapper,
  ) {}

  create(command: CreateProductCommand): ProductsInfo {
    const initProduct = this.productsCommandMapper.toProductEntity(command);
    const product = this.productStore.store(initProduct);
    return this.productsCommandMapper.ofInfo(product);
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
