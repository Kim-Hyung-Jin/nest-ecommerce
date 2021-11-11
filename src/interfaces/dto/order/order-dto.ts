export class CreateOrder {
  userId: number;
  payMethod: string;
  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
  orderLineList: CreateOrderLine[];
}

export class CreateOrderLine {
  ordering: number;
  productCode: string;
  orderCount: number;
  productPrice: number;
  productOptionGroupList: CreateOrderProductOptionGroup[];
}

export class CreateOrderProductOptionGroup {
  productOptionGroupName: string;
  ordering: number;
  productionOptionList: CreateOrderProductOption[];
}

export class CreateOrderProductOption {
  productOptionPrice: number;
  productOptionName: string;
  ordering: number;
}