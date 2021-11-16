import { Product } from './entity/product.entity';
import { Order } from './entity/order.entity';

export default interface OrderReader {
  getOrder: (orderCode: string) => Promise<Order>;
}
