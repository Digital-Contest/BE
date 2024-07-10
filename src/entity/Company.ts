import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { ProductCompany } from "./ProductCompany.js";


@Entity("company")
export class Company extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @OneToMany(() => ProductCompany,  productCompanys =>  productCompanys.company)
    productCompanys: Relation<ProductCompany>[];


}