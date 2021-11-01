import { Product } from './entity/product.entity';
import { ProductsOptionGroupInfo } from './dto/products.info';

export interface ProductsReader {
  getProductByCode: (productCode: string) => Promise<Product>;
  getProductOptionGroupInfoList: (
    product: Product,
  ) => ProductsOptionGroupInfo[];
}
