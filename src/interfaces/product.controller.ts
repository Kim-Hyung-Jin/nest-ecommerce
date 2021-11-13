import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import ProductFacade from '../application/product.facade';
import { CreateProductDto } from './dto/product/create-product.dto';
import { CreateProductResponse } from './dto/product/create-product.response';
import { ProductDtoMapper } from './product-dto.mapper';
import { ProductResult } from '../domain/product.result';

@Controller('products')
export default class ProductController {
  constructor(
    private readonly productFacade: ProductFacade,
    private readonly productDtoMapper: ProductDtoMapper,
  ) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreateProductResponse> {
    const command =
      this.productDtoMapper.toCreateProductCommand(createProductDto);
    const result = await this.productFacade.register(command);
    return this.productDtoMapper.ofResponse(result);
  }

  //
  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }
  //
  @Get(':productCode')
  async getOne(
    @Param('productCode') productCode: string,
  ): Promise<ProductResult> {
    const result = await this.productFacade.getOne(productCode);
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
