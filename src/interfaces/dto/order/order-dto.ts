export class CreateOrder {
  userId: string;
  payMethod: string;
  address: CreateAddress;
  orderLineList: CreateOrderLine[];
}

export class CreateAddress {
  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
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
