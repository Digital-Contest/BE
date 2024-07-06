import { IsNotEmpty } from "class-validator";



export class IntroduceText{

    @IsNotEmpty()
    private image:File[];

    @IsNotEmpty()
    private category:string;

    @IsNotEmpty()
    private price:number;
    
    @IsNotEmpty()
    private product: string;

}