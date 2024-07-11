// import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
// import { BaseEntity } from "./base/BaseEntity.js";
// import { Product } from "./Product.js";


// @Entity("introduce_text_category")
// export class IntroduceTextCategory extends BaseEntity{
//     findIntroduceTextCategoryByName(category: string) {
//         throw new Error("Method not implemented.");
//     }

    
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column({ type: 'varchar', name: 'name', nullable: false })
//     name:string;

//     @Column({ type: 'varchar', name: 'prompt_text', nullable: false })
//     promptText:string;


//     @OneToMany(() => Product,  products =>  products.introduceTextCategory)
//     products: Relation< Product>[];



// }