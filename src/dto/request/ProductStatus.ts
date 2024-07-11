import { IsNotEmpty } from "class-validator";




export class ProductStatus{

    @IsNotEmpty()
    private productId:number;

    @IsNotEmpty()
    private status:boolean;

    public getProductId(){
        return this.productId;
    }

    public getStatus(){
        return this.status;
    }


}