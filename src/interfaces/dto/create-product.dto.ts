import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  readonly productName: string;

  @IsNumber()
  readonly productPrice: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateProductOptionGroupDto)
  readonly productOptionGroupList: CreateProductOptionGroupDto[];
}

export class CreateProductOptionGroupDto {
  @IsString()
  readonly productOptionGroupName: string;

  @IsNumber()
  readonly ordering: number;

  @IsOptional()
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
