import { IsNotEmpty } from "class-validator";



export class IntroduceTextRequest{

    @IsNotEmpty()
    private introduceCategory:string;

    @IsNotEmpty()
    private price:number;
    
    @IsNotEmpty()
    private productCategory: string;

    @IsNotEmpty()
    private product:string

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

}