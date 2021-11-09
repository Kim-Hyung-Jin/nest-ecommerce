import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOption from './product-option.entity';
import { Products } from './product.entity';

@Entity()
export default class ProductOptionGroup extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionGroupName: string;

  @Column({ type: 'int', nullable: false })
  ordering: number;

  @OneToMany(
    type => ProductOption,
    productOption => productOption.productOptionGroup,
    {
      cascade: true,
    },
  )
  productOptionList: ProductOption[];

  @ManyToOne(type => Products, product => product.productOptionGroupList)
  product: Products;

  constructor(
    productOptionGroupName: string,
    ordering: number,
    productOptionList: ProductOption[],
  ) {
    super();
    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
    this.productOptionList = productOptionList;
  }

  updateOptionGroup(productOptionGroupName: string, ordering: number) {
    if (productOptionGroupName == undefined && ordering == undefined)
      throw new Error('업데이트 할 값이 없음');

    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
  }
}
