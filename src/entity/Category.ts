import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";



@Entity("Category")
@Unique(['name'])
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