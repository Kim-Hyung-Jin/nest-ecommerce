import Product from '../products/entities/product.entity';

export default interface ProductsStore {
  store: (product: Product) => Product;
}
