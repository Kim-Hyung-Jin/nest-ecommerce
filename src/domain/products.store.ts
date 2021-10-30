import { Product } from './entity/product.entity';

export default interface ProductsStore {
  store: (product: Product) => Promise<Product>;
}
