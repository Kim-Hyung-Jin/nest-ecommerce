import { Product } from '../entity/product/product.entity';
import { OrderPersist } from '../entity/order/persist/order.persist';
import { Order } from '../entity/order/order';

export default interface OrderReader {
  getOrder: (orderCode: string) => Promise<Order>;
}
