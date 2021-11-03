import { Products } from './entity/product.entity';
import { ProductsOptionGroupInfo } from './dto/products.info';

export interface ProductsReader {
  getByProductCode: (productCode: string) => Promise<Products>;
  getProductOptionGroupInfoList: (
    product: Products,
  ) => ProductsOptionGroupInfo[];
}
