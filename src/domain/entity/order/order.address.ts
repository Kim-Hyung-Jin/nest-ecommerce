import { OrderAddressPersist } from './persist/order.address.persist';

export class OrderAddress {
  persist: OrderAddressPersist;

  constructor(orderAddress: OrderAddressPersist) {
    this.persist = orderAddress;
  }
}
