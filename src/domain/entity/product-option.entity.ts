import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';

@Entity()
export default class ProductOption extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionName: string;

  @Column({ type: 'int', nullable: false })
  ordering: number;

  @Column({ type: 'int', nullable: false })
  productOptionPrice: number;

  @ManyToOne(
    type => ProductOptionGroup,
    productOptionGroup => productOptionGroup.productOptionList,
  )
  productOptionGroup: ProductOptionGroup;
}
