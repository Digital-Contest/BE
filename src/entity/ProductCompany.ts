import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";


@Entity("product_company")
export class ProductCompany extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;



}