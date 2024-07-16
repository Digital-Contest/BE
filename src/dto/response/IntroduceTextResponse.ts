

export class IntroduceTextResponse{
    private introduceText:string;
    private price:number;

    constructor(introduceText:string, price: number){
        this.setIntroduceText(introduceText);
        this.setPrice(price);
    }

    public static of(introduceText:string, price: number){
        return new IntroduceTextResponse(introduceText, price);
    }


    private setIntroduceText(introduceText:string){
        this.introduceText=introduceText;
    }

    private setPrice(price:number){
        this.price=price;
    }
}