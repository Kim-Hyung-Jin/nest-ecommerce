export class CreateProductDto {
  productName: string;
  productPrice: number;
  productOptionGroupList: CreateProductOptionGroupDto[];
}

export class CreateProductOptionGroupDto {
  productOptionGroupName: string;
  ordering: number;
  productOptionList: CreateProductOptionDto[];
}

export class CreateProductOptionDto {
  productOptionName: string;
  ordering: number;
  productOptionPrice: number;
}
