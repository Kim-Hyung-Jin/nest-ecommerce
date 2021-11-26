import { Product } from '../entity/product/product.entity';
import { OrderPersist } from '../entity/order/persist/order.persist';

export default interface OrderStore {
  store: (order: OrderPersist) => Promise<OrderPersist>;
}
