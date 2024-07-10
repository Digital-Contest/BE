import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";


@Entity("product_image")
export class ProductImage extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'url', nullable: false })
    url:string;



}