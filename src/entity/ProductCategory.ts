


import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { Product } from "./Product.js";


@Entity("product_category")
export class ProductCategory extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'score', nullable: false })
    score:string;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @ManyToOne(() => Product, product => product.productCategorys, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Relation<Product>;


}