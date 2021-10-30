import { Products } from './entity/product.entity';

export default interface ProductsStore {
  store: (product: Products) => Promise<Products>;
}
