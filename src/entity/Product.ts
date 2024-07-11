import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
// import { ProductCategory } from "./ProductCategory.js";
// import { IntroduceTextCategory } from "./IntroduceTextCategory.js";
//import { ProductImage } from "./ProductImage.js";
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


    @Column({ type: 'varchar', name: 'image_url', nullable: false })
    imageUrl:string;


    @ManyToOne(() => User, user => user.products, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;

    // @OneToMany(() => ProductImage,  productImages =>  productImages.product)
    // productImages: Relation<ProductImage>[];

    @OneToMany(() => ProductCompany,  productCompanys =>  productCompanys.product)
    productCompanys: Relation<ProductCompany>[];


    public getId(){
        return this.id
    }

    public getPrice(){
        return this.price;
    }

    public getUser(){
        return this.user;
    }

    public getProductCategory(){
        return this.productCategory;
    }



}