import { IsString } from 'class-validator';

export interface ProductResponse {
  productCode: string;
}

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

export interface GetProductResponse {
  productInfo: {
    productName: string;
    productPrice: number;
    productCode: string;
    status: string;
    productOptionGroupList: [
      {
        productOptionGroupName: string;
        ordering: number;
        productOptionList: [
          {
            productOptionName: string;
            productOptionPrice: number;
            ordering: number;
          },
        ];
      },
    ];
  };
}