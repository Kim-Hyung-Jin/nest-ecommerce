import { ProductsPersist } from './entity/persist/product.persist-entity';
import { Products } from './entity/product.entity';
import ProductOptionGroup from './entity/product-option-group.entity';

export default interface ProductsStore {
  store: (
    productName: string,
    productPrice: number,
    productOptionGroupList: ProductOptionGroup[],
  ) => Promise<Products>;
}
