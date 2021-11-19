import { Product } from '../entity/product/product.entity';
import { Order } from '../entity/order/order.entity';

export default interface OrderStore {
  store: (order: Order) => Promise<Order>;
}
