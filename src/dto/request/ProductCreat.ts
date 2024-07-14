import { IsEmpty, IsNotEmpty, IsOptional } from "class-validator";



export class ProductCreate{

    @IsNotEmpty()
    private introduceCategory:string;

    @IsOptional()
    private price:number | null;
    
    @IsNotEmpty()
    private productCategory: string;

    @IsNotEmpty()
    private product:string;

    @IsNotEmpty()
    private introduceText:string;

    // @IsNotEmpty()
    // private imageUrl:string;

    @IsNotEmpty()
    private companys:string[];


    public getIntroduceCategory(){
        return this.introduceCategory;
    }

    public getPrice(){
        return this.price;
    }

    public getProduct(){
        return this.product;
    }

    public getProductCategory(){
        return this.productCategory;
    }

    public getIntroduceText(){
        return this.introduceText;
    }

    // public getImageUrl(){
    //     return this.imageUrl;
    // }

    public getCompanys(){
        return this.companys;
    }

}