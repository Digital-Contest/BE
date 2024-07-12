import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { BaseEntity } from "./base/BaseEntity.js";
import { User } from "./User.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { ProductCompany } from "./ProductCompany.js";
import { ProductCreate } from "../dto/request/ProductCreat.js";


@Entity("product")
@Index("idx_product_user", ["user"])
export class Product extends BaseEntity{

    constructor(
        userId:number, imageUrl:string, introduceCategory:string, price:number, productCategory:string,
        product:string, introduceText:string){
        super()
        this.setUserId(userId),
        this.setImageUrl(imageUrl);
        this.setIntroduceCategory(introduceCategory);
        this.setPrice(price);
        this.setProductCategory(productCategory);
        this.setProduct(product);
        this.setIntroduceText(introduceText);
    }

    public static createProduct(
        userId:number, imageUrl:string, introduceCategory:string, price:number, productCategory:string,
        product:string, introduceText:string){
        return new Product(userId, imageUrl, introduceCategory, price, productCategory, product, introduceText)
    }

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', name: 'price', nullable: false })
    price:number;

    @Column({ type: 'varchar', name: 'name', nullable: false })
    name:string;

    @Column({ type: 'boolean', name: 'status', nullable: true })
    status:boolean;

    @Column({ type: 'varchar', name: 'introduce_text', nullable: false })
    introduceText:string;

    @Column({ type: 'varchar', name: 'product_category', nullable: false })
    productCategory:string;

    @Column({ type: 'varchar', name: 'introduce_text_category', nullable: false })
    introduceTextCategory:string;

    @Column({ type: 'int', name: 'user_id', nullable: false })
    userId:number;


    @Column({ type: 'varchar', name: 'image_url', nullable: false })
    imageUrl:string;


    @ManyToOne(() => User, user => user.products, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    @JoinColumn({ name: "user_id", referencedColumnName: "id" })
    user: Relation<User>;

    // @OneToMany(() => ProductImage,  productImages =>  productImages.product)
    // productImages: Relation<ProductImage>[];

    @OneToMany(() => ProductCompany,  productCompanys =>  productCompanys.product)
    productCompanys: Relation<ProductCompany>[];


    public getId(){
        return this.id
    }

    public getPrice(){
        return this.price;
    }

    public getUser(){
        return this.user;
    }

    public getProductCategory(){
        return this.productCategory;
    }

    public getProduct(){
        return this.name;
    }

    public getCreatedAt(){
        return this.createdAt;
    }

    public getImageUrl(){
        return this.imageUrl;
    }

    public getProductCompanys(){
        return this.productCompanys;
    }

   private setIntroduceCategory(introduceCategory: string) {
        if (introduceCategory === null) 
            throw new Error(`${__dirname} : introduceCategory 값이 존재하지 않습니다.`);
        this.introduceTextCategory = introduceCategory;
    }

    private setPrice(price: number) {
        if (price === null) 
            throw new Error(`${__dirname} : price 값이 존재하지 않습니다.`);
        this.price=price
    }

    private setProductCategory(productCategory: string) {
        if (productCategory === null) 
            throw new Error(`${__dirname} : productCategory 값이 존재하지 않습니다.`);
        this.productCategory = productCategory;
    }

    private setProduct(product: string) {
        if (product === null) 
            throw new Error(`${__dirname} : product 값이 존재하지 않습니다.`);
        this.name=product
    }

    private setIntroduceText(introduceText: string) {
        if (introduceText === null) 
            throw new Error(`${__dirname} : introduceText 값이 존재하지 않습니다.`);
        this.introduceText = introduceText;
    }

    private setImageUrl(imageUrl: string) {
        if (imageUrl === null) 
            throw new Error(`${__dirname} : imageUrl 값이 존재하지 않습니다.`);
        this.imageUrl = imageUrl;
    }


    private setUserId(userId:number) {
        if (userId === null) 
            throw new Error(`${__dirname} : userId 값이 존재하지 않습니다.`);
        this.userId=userId;
    }


}