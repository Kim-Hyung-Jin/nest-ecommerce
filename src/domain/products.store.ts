import { ProductsPersist } from './entity/persist/product.persist-entity';
import { Products } from './entity/product.entity';
import ProductOptionGroup from './entity/product-option-group.entity';
import { CreateProductCommand } from './dto/create-product.command';

export default interface ProductsStore {
  store: (command: CreateProductCommand) => Promise<Products>;
}
