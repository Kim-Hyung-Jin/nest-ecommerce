export interface CreateProductCommand {
  productName: string;
  productPrice: number;
  productOptionGroupList: CreateProductOptionGroupCommand[];
}

export interface CreateProductOptionGroupCommand {
  productOptionGroupName: string;
  ordering: number;
  productOptionList: CreateProductOptionCommand[];
}

export interface CreateProductOptionCommand {
  productOptionName: string;
  ordering: number;
  productOptionPrice: number;
}

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
