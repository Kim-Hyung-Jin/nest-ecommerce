export interface UpdateProductResponse {
  productName: string;
  productPrice: number;
  productCode: string;
  status: string;
  productOptionGroupList: {
    id: number;
    productOptionGroupName: string;
    ordering: number;
    productOptionList: {
      id: number;
      productOptionName: string;
      productOptionPrice: number;
      ordering: number;
    }[];
  }[];
}
