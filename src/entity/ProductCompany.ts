import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity";
import { Product } from "./Product";
import path from 'path';
import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


@Entity("product_company")
@Index("idx_product_company_product_company", ["product","company"])
export class ProductCompany extends BaseEntity{

    constructor(company:string, productId:number){
        super();
        this.setCompany(company);
        this.setProductId(productId);
    }
    

    public static createProductCompany(company:string, productId:number){
        return new ProductCompany(company, productId);
    }
    
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ type: 'varchar', name: 'company', nullable: false })
    company:string;

    @Column({ type: 'int', name: 'product_id', nullable: false })
    productId:number;

    @ManyToOne(() => Product, product => product.productCompanys, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "product_id", referencedColumnName: "id" })
    product: Relation<Product>;


    public getCompany(){
        return this.company;
    }

    public getProducty(){
        return this.product;
    }


    private setCompany(company:string){
        if (company === null) 
            throw new Error(`${__dirname} : company 값이 존재하지 않습니다.`);
        this.company=company;
    }

    private setProductId(productId:number){
        if (productId === null) 
            throw new Error(`${__dirname} : product 값이 존재하지 않습니다.`);
        this.productId=productId
    }



 

    // @ManyToOne(() => Company, company => company.productCompanys, {
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE",
    // })
    // @JoinColumn({ name: "company_id", referencedColumnName: "id" })
    // company: Relation<Company>;



}