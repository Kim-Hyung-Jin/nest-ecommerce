export interface ProductsInfo {
  productName: string;
  productPrice: number;
  productCode: string;
  status: string;
  productOptionGroupList: ProductsOptionGroupInfo[];
}
export interface ProductsOptionGroupInfo {
  productOptionGroupName: string;
  ordering: number;
  productOptionList: ProductsOptionInfo[];
}
export interface ProductsOptionInfo {
  productOptionName: string;
  productOptionPrice: number;
  ordering: number;
}
