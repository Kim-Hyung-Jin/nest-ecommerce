export interface UpdateProductCommand {
  productCode: string;
  productName: string;
  productPrice: number;
}

export interface UpdateProductOptionGroupCommand {
  productCode: string;
  id: number;
  productOptionGroupName: string;
  ordering: number;
}

export interface UpdateProductOptionCommand {
  productCode: string;
  optionGroupId: number;
  id: number;
  productOptionName: string;
  ordering: number;
  productOptionPrice: number;
}
