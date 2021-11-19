import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  readonly productName: string;

  @IsNumber()
  readonly productPrice: number;

  @Exclude()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionGroupDto)
  readonly productOptionGroupList: CreateProductOptionGroupDto[];
}

export class CreateProductOptionGroupDto {
  @IsString()
  readonly productOptionGroupName: string;

  @IsNumber()
  readonly ordering: number;

  @Exclude()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionGroupDto)
  productOptionList: CreateProductOptionDto[];
}

export class CreateProductOptionDto {
  @IsString()
  productOptionName: string;

  @IsNumber()
  ordering: number;

  @IsNumber()
  productOptionPrice: number;
}

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
