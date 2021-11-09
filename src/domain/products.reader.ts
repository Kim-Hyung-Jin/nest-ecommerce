import { Products } from './entity/product.entity';
import { ProductsOptionGroupInfo } from './dto/products.info';

export interface ProductsReader {
  getProductBy: (productCode: string) => Promise<Products>;
  getAllOptionInfoList: (product: Products) => ProductsOptionGroupInfo[];
}
