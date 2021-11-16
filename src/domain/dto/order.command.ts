export interface CreateOrder {
  userId: string;
  payMethod: string;
  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
  orderLineList: CreateOrderLine[];
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
