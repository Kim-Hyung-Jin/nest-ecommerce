import { Product } from '../entity/product/product.entity';
import { OrderPersist } from '../entity/order/persist/order.persist';

export default interface OrderReader {
  getOrder: (orderCode: string) => Promise<OrderPersist>;
}
