import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';

export enum ProductStatus {
  PREPARE = '준비중',
  ONSALE = '판매중',
  ENDOFSALE = '판매종료',
}

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productName: string;

  @Column({ type: 'varchar', nullable: false })
  productCode: string = v4();

  @Column({ type: 'int', nullable: false })
  productPrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PREPARE,
  })
  status: ProductStatus = ProductStatus.PREPARE;

  @OneToMany(
    type => ProductOptionGroup,
    ProductOptionGroup => ProductOptionGroup.product,
    {
      cascade: true,
    },
  )
  readonly productOptionGroupList: ProductOptionGroup[];

  constructor(
    productName: string,
    productPrice: number,
    productOptionGroupList: ProductOptionGroup[],
  ) {
    super();
    this.productName = productName;
    this.productPrice = productPrice;
    this.productOptionGroupList = productOptionGroupList;
  }

  updateProduct(productName: string, productPrice: number) {
    if (productName == undefined && productPrice == undefined) {
      throw new Error('업데이트 할 값이 없음');
    }
    if (productName != undefined) {
      this.productName = productName;
    }

    if (productPrice != undefined) {
      this.productPrice = productPrice;
    }
  }

  updateProductOptionGroup(
    optionGroupId: number,
    productOptionGroupName: string,
    ordering: number,
  ) {
    if (optionGroupId == undefined)
      throw new Error('업데이트 할 optionGroup id가 없음');
    if (productOptionGroupName == undefined && ordering == undefined)
      throw new Error('업데이트 할 값이 없음');

    const optionGroup = this.getOptionGroup(optionGroupId);
    optionGroup.updateOptionGroup(productOptionGroupName, ordering);
  }

  updateProductOption(
    optionGroupId: number,
    id: number,
    productOptionName: string,
    ordering: number,
    productOptionPrice: number,
  ) {
    if (optionGroupId == undefined)
      throw new Error('업데이트 할 option 의 Group id가 없음');
    if (
      productOptionName == undefined &&
      ordering == undefined &&
      productOptionPrice == undefined
    )
      throw new Error('업데이트 할 값이 없음');

    const optionGroup = this.getOptionGroup(optionGroupId);
    const option = this.getOption(optionGroup, id);
    option.updateProductOption(productOptionName, ordering, productOptionPrice);
  }

  private getOptionGroup(optionGroupId: number) {
    return this.productOptionGroupList.find(value => optionGroupId == value.id);
  }

  private getOption(optionGroup: ProductOptionGroup, optionId: number) {
    return optionGroup.productOptionList.find(value => value.id == optionId);
  }
}
