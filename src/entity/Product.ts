import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";


@Entity("product")
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

}