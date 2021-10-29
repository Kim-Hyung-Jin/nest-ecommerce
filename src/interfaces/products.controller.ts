import { Body, Controller, Post } from '@nestjs/common';
import ProductsFacade from '../application/products.facade';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { CreateProductResponse } from '../products/dto/create-product.response';
import { ProductsDtoMapper } from '../products/dto/products-dto.mapper';

@Controller('products')
export default class ProductsController {
  constructor(
    private readonly productsFacade: ProductsFacade,
    private readonly productsDtoMapper: ProductsDtoMapper,
  ) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    const command =
      this.productsDtoMapper.toCreateProductCommand(createProductDto);
    const result = this.productsFacade.registerProduct(command);
    return {
      productCode: result.productInfo.productCode,
    };
  }
  //
  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.productsService.findOne(+id);
  // }
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
