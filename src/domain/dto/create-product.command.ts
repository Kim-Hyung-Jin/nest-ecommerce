export interface ProductsCreateCommand {
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
