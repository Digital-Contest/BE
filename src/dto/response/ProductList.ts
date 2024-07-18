import path from 'path';
import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const __filename = fileURLToPath(__filename);
// const __dirname = path.dirname(__filename);
export class ProductList {

    private productId: number;
    private product: string;
    private productCategory: string;
    private imageUrl: string;
    private createdAt: string;
    private company: string[];
    private price:number;

    constructor(productId: number, product: string, productCategory: string, imageUrl: string, createdAt: string, company: string[], price:number) {
        this.setProductId(productId);
        this.setProduct(product);
        this.setProductCategory(productCategory);
        this.setImageUrl(imageUrl);
        this.setCreatedAt(createdAt);
        this.setCompany(company);
        this.setPrice(price);
    }

    private setProductId(productId: number) {
        if (productId === null) throw new Error (`${__dirname} : productId 값이 존재하지 않습니다.`);
        this.productId = productId;
    }

    private setProduct(product: string) {
        if (!product) throw new Error (`${__dirname} : product 값이 존재하지 않습니다.`);
        this.product = product;
    }

    private setProductCategory(productCategory: string) {
        if (!productCategory) throw new Error (`${__dirname} : productCategory 값이 존재하지 않습니다.`);
        this.productCategory = productCategory;
    }

    private setImageUrl(imageUrl: string) {
        if (!imageUrl) throw new Error (`${__dirname} : imageUrl 값이 존재하지 않습니다.`);
        this.imageUrl = imageUrl;
    }

    private setCreatedAt(createdAt: string) {
        if (!createdAt) throw new Error (`${__dirname} : createdAt 값이 존재하지 않습니다.`);
        this.createdAt = createdAt;
    }

    private setCompany(company: string[]) {
        if (!company || company.length === 0) throw new Error (`${__dirname} : company 값이 존재하지 않습니다.`);
        this.company = company;
    }

    private setPrice(price:number){
        if(price === null)throw new Error (`${__dirname} : company 값이 존재하지 않습니다.`);
        this.price=price;
    }



    public static of(productList:ProductList[]) {
        return productList.map((data)=>{
            return new ProductList(data.productId, data.product, data.productCategory, data.imageUrl, data.createdAt, data.company, data.price);
        })
      
    }



}
