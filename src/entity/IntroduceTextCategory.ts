import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";


@Entity("introduce_text_category")
export class IntroduceTextCategory extends BaseEntity{

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @Column({ type: 'varchar', name: 'prompt_text', nullable: false })
    promptText:string;


}