import * as OrderInfo from './dto/order.info';
import * as OrderCommand from './dto/order.command';
import * as OrderResult from './dto/order.result';

export default interface OrderService {
  create(command: OrderCommand.CreateOrder): Promise<OrderInfo.Simple>;

  get(orderCode: string): Promise<OrderInfo.Simple>;

  cancel(orderCode: string): Promise<OrderInfo.Simple>;

  partCancel(
    orderCode: string,
    orderLineCodeList: number[],
  ): Promise<OrderInfo.Simple>;
}
