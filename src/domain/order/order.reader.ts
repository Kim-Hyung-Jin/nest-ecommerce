import { Product } from '../entity/product/product.entity';
import { Order } from '../entity/order/order.entity';

export default interface OrderReader {
  getOrder: (orderCode: string) => Promise<Order>;
}
