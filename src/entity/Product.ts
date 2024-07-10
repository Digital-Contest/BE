import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
import { ProductCategory } from "./ProductCategory.js";
import { IntroduceTextCategory } from "./IntroduceTextCategory.js";
import { ProductImage } from "./ProductImage.js";


@Entity("product")
@Index("idx_product_user", ["user"])
export class Product extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'price', nullable: false })
    price:string;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @Column({ type: 'boolean', name: 'status', nullable: false })
    status:string;

    @Column({ type: 'varchar', name: 'introduce_text', nullable: false })
    introduceText:string;

    @ManyToOne(() => User, user => user.products, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;

    @OneToMany(() => ProductCategory, productCategorys => productCategorys.product)
    productCategorys: Relation<ProductCategory>[];

    @OneToMany(() => IntroduceTextCategory,  introduceTextCategorys =>  introduceTextCategorys.product)
    introduceTextCategorys: Relation<IntroduceTextCategory>[];

    @OneToMany(() => ProductImage,  productImages =>  productImages.product)
    productImages: Relation<ProductImage>[];



}