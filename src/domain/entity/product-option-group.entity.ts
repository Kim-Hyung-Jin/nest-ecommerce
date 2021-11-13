import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOption from './product-option.entity';
import { Product } from './product.entity';

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

  @ManyToOne(type => Product, product => product.productOptionGroupList)
  product: Product;

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
    //TODO 이 유효성 검사를 product fucntion에서도 하는데 여기에서도 해야되나

    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
  }
}
