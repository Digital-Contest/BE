import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { Product } from "./Product.js";


@Entity("product_image")
@Index("idx_product_image_product", ["product"])
export class ProductImage extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'url', nullable: false })
    url:string;

    @ManyToOne(() => Product, product => product.productImages, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Relation<Product>;


}