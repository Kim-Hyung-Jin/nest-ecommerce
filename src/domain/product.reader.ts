import { Product } from './entity/product.entity';
import { ProductOptionGroupInfo } from './dto/product.info';

export interface ProductReader {
  getProductBy: (productCode: string) => Promise<Product>;
  getAllOptionInfoList: (product: Product) => ProductOptionGroupInfo[];
}
