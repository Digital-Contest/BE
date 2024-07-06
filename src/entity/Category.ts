import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity.js";



@Entity("Category")
export class Category extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name:string;

    public getId(){
        return this.id;
    }

    public getName(){
        return this.name;
    }
}