import { Product } from '../entity/product/product.entity';

export default interface ProductStore {
  store: (product: Product) => Promise<Product>;
}
