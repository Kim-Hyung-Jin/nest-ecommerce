export interface ProductInfo {
  productName: string;
  productPrice: number;
  productCode: string;
  status: string;
  productOptionGroupList: ProductOptionGroupInfo[];
}
export interface ProductOptionGroupInfo {
  id: number;
  productOptionGroupName: string;
  ordering: number;
  productOptionList: ProductOptionInfo[];
}
export interface ProductOptionInfo {
  id: number;
  productOptionName: string;
  productOptionPrice: number;
  ordering: number;
}
