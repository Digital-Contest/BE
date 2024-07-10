


import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";


@Entity("product_category")
export class ProductCategory extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'score', nullable: false })
    score:string;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;


}