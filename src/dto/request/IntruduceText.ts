import { IsNotEmpty } from "class-validator";



export class IntroduceText{

    @IsNotEmpty()
    private images:File[];

    @IsNotEmpty()
    private category:string;

    @IsNotEmpty()
    private price:number;
    
    @IsNotEmpty()
    private product: string;


    public getImages(){
        return this.images;
    }

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