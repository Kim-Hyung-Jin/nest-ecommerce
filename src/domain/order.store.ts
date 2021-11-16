import { Product } from './entity/product.entity';
import { Order } from './entity/order.entity';

export default interface OrderStore {
  store: (order: Order) => Promise<Order>;
}
