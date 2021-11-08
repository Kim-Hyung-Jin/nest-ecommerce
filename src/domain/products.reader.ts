import { ProductsPersist } from './entity/persist/product.persist-entity';
import { ProductsOptionGroupInfo } from './dto/products.info';
import { Products } from './entity/product.entity';

export interface ProductsReader {
  getByProductCode: (productCode: string) => Promise<Products>;
  getAllOptionInfoList: (product: Products) => ProductsOptionGroupInfo[];
}
