import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
// import { ProductCategory } from "./ProductCategory.js";
// import { IntroduceTextCategory } from "./IntroduceTextCategory.js";
import { ProductImage } from "./ProductImage.js";
import { ProductCompany } from "./ProductCompany.js";


@Entity("product")
@Index("idx_product_user", ["user"])
export class Product extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'price', nullable: false })
    price:string;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @Column({ type: 'boolean', name: 'status', nullable: true })
    status:boolean;

    @Column({ type: 'varchar', name: 'introduce_text', nullable: false })
    introduceText:string;

    @Column({ type: 'varchar', name: 'product_category', nullable: false })
    productCategory:string;

    @Column({ type: 'varchar', name: 'introduce_text_category', nullable: false })
    introduceTextCategory:string;


    @ManyToOne(() => User, user => user.products, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;


    // @ManyToOne(() => IntroduceTextCategory, introduceTextCategory => introduceTextCategory.products, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn({ name: "introduce_text_category_id", referencedColumnName: "id" })
    // introduceTextCategory: Relation<IntroduceTextCategory>;


    // @ManyToOne(() => ProductCategory, productCategory => productCategory.products, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn({ name: "product_category_id", referencedColumnName: "id" })
    // productCategory: Relation<ProductCategory>;

    

    @OneToMany(() => ProductImage,  productImages =>  productImages.product)
    productImages: Relation<ProductImage>[];

    @OneToMany(() => ProductCompany,  productCompanys =>  productCompanys.product)
    productCompanys: Relation<ProductCompany>[];



}