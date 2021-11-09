export interface ProductsInfo {
  productName: string;
  productPrice: number;
  productCode: string;
  status: string;
  productOptionGroupList: ProductsOptionGroupInfo[];
}
export interface ProductsOptionGroupInfo {
  id: number;
  productOptionGroupName: string;
  ordering: number;
  productOptionList: ProductsOptionInfo[];
}
export interface ProductsOptionInfo {
  id: number;
  productOptionName: string;
  productOptionPrice: number;
  ordering: number;
}
