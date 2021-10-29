import Product from '../products/entities/product.entity';
import { ProductOptionGroupInfo } from '../products/dto/product-Info';

export interface ProductsReader {
  getProductByCode: (productCode: string) => Product;
  getProductOptionGroupInfoList: (product: Product) => ProductOptionGroupInfo;
}
