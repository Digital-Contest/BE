import { IsNotEmpty } from "class-validator";



export class IntroduceText{

    @IsNotEmpty()
    private category:string;

    @IsNotEmpty()
    private price:number;
    
    @IsNotEmpty()
    private product: string;

    public getCategory(){
        return this.category;
    }

    public getPrice(){
        return this.price;
    }

    public getProduct(){
        return this.product;
    }

}