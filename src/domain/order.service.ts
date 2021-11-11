import * as OrderInfo from './dto/order.info';
import * as OrderCommand from './dto/order.command';
import * as OrderResult from './dto/order.result';

export default interface OrderService {
  create(command: OrderCommand.CreateOrder): Promise<OrderResult.Simple>;

  cancel(): OrderInfo.Simple;

  partCancel(): OrderInfo.Simple;
}
