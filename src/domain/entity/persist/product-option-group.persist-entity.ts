import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionPersist from './product-option.persist-entity';
import { ProductsPersist } from './product.persist-entity';

@Entity()
export default class ProductOptionGroupPersist extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionGroupName: string;

  @Column({ type: 'int', nullable: false }) ordering: number;

  @OneToMany(
    type => ProductOptionPersist,
    productOption => productOption.productOptionGroup,
    {
      cascade: true,
    },
  )
  productOptionList: ProductOptionPersist[];

  @ManyToOne(type => ProductsPersist, product => product.productOptionGroupList)
  product: ProductsPersist;

  constructor(
    productOptionGroupName: string,
    ordering: number,
    productOptionList: ProductOptionPersist[],
  ) {
    super();
    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
    this.productOptionList = productOptionList;
  }
}
