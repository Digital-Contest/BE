

export class IntroduceTextResponse{
    private introduceText:string;

    constructor(introduceText:string){
        this.setIntroduceText(introduceText);
    }

    public static of(introduceText:string){
        return new IntroduceTextResponse(introduceText);
    }


    private setIntroduceText(introduceText:string){
        this.introduceText=introduceText;
    }
}