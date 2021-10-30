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
