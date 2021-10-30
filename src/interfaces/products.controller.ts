import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import ProductsFacade from '../application/products.facade';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductResponse } from './dto/create-product.response';
import { ProductsDtoMapper } from './products-dto.mapper';
import { ProductsResult } from '../domain/products.result';

@Controller('products')
export default class ProductsController {
  constructor(
    private readonly productsFacade: ProductsFacade,
    private readonly productsDtoMapper: ProductsDtoMapper,
  ) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductResponse> {
    const command =
      this.productsDtoMapper.toCreateProductCommand(createProductDto);
    const result = await this.productsFacade.registerProduct(command);
    return this.productsDtoMapper.ofResponse(result);
  }

  //
  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }
  //
  @Get(':productCode')
  async findOne(
    @Param('productCode') productCode: string,
  ): Promise<ProductsResult> {
    const result = await this.productsFacade.getProduct(productCode);
    return result;
  }

  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productsService.remove(+id);
  // }
}
