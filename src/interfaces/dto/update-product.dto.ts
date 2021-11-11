import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  CreateProductDto,
  CreateProductOptionDto,
  CreateProductOptionGroupDto,
} from './create-product.dto';

export class UpdateProductDto extends OmitType(CreateProductDto, [
  'productOptionGroupList',
] as const) {
  productCode: string;
}

export class UpdateProductOptionGroupDto extends OmitType(
  CreateProductOptionGroupDto,
  ['productOptionList'] as const,
) {
  productCode: string;
  id: number;
}

export class UpdateProductOptionDto extends CreateProductOptionDto {
  productCode: string;
  optionGroupId: number;
  id: number;
}
