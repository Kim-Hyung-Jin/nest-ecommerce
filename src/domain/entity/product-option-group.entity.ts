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
}
