export interface CreateOrder {
  userId: string;
  payMethod: string;
  address: CreateAddress;
  orderLineList: CreateOrderLine[];
}

export interface CreateAddress {
  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
}

export interface CreateOrderLine {
  ordering: number;
  productCode: string;
  orderCount: number;
  productPrice: number;
  productOptionGroupList: CreateOrderProductOptionGroup[];
}

export interface CreateOrderProductOptionGroup {
  productOptionGroupName: string;
  ordering: number;
  productionOptionList: CreateOrderProductOption[];
}

export interface CreateOrderProductOption {
  productOptionPrice: number;
  productOptionName: string;
  ordering: number;
}

export interface CancelOrder {
  orderCode: string;
}

export interface PartCancelOrder {
  orderCode: string;
  orderLineIdList: number[];
}
