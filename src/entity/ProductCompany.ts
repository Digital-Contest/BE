import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { Product } from "./Product.js";
import { Company } from "./Company.js";


@Entity("product_company")
@Index("idx_product_company_product_company", ["product","company"])
export class ProductCompany extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.productCompanys, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Relation<Product>;


    @ManyToOne(() => Company, company => company.productCompanys, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "company_id", referencedColumnName: "id" })
    company: Relation<Company>;



}