import { ProductsPersist } from './entity/persist/product.persist-entity';
import { Products } from './entity/product.entity';
import ProductOptionGroup from './entity/product-option-group.entity';
import { ProductsCreate } from './dto/products-create';

export default interface ProductsStore {
  store: (product: ProductsCreate) => Promise<Products>;
}
