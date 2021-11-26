export interface Simple {
  orderCode: string;
  userId: string;
  payMethod: string;
  address: OrderAddress;
  orderLineList: OrderLine[];
}

export interface OrderAddress {
  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
}

export interface OrderLine {
  ordering: number;
  productCode: string;
  orderCount: number;
  productPrice: number;
  status: string;
  productOptionGroupList: OrderProductOptionGroup[];
}

export interface OrderProductOptionGroup {
  productOptionGroupName: string;
  ordering: number;
  productionOptionList: OrderProductOption[];
}

export interface OrderProductOption {
  productOptionPrice: number;
  productOptionName: string;
  ordering: number;
}
