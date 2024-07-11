


// import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
// import { BaseEntity } from "./base/BaseEntity.js";
// import { Product } from "./Product.js";


// @Entity("product_category")
// export class ProductCategory extends BaseEntity{

//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ type: 'int', name: 'score', nullable: false })
//     score:string;

//     @Column({ type: 'varchar', name: 'name', nullable: false })
//     name:string;
    
//     @OneToMany(() => Product,  products => products.productCategory)
//     products: Relation<Product>[];

// }