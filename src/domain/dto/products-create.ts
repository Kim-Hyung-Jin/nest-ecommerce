export interface ProductsCreate {
  productName: string;
  productPrice: number;
  productOptionGroupList: ProductOptionGroupCreate[];
}

export interface ProductOptionGroupCreate {
  productOptionGroupName: string;
  ordering: number;
  productOptionList: ProductOptionCreate[];
}

export interface ProductOptionCreate {
  productOptionName: string;
  ordering: number;
  productOptionPrice: number;
}
