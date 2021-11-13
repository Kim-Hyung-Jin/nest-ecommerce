import { Product } from './entity/product.entity';

export default interface ProductStore {
  store: (product: Product) => Promise<Product>;
}
