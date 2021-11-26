import { Product } from '../entity/product/product.entity';
import { ProductOptionGroupInfo } from '../dto/product/product.info';

export interface ProductReader {
  getProductBy: (productCode: string) => Promise<Product>;
  getAllOptionInfoList: (product: Product) => ProductOptionGroupInfo[];
}
