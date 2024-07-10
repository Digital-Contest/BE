
export class LevelColor{

    private color:string;

    constructor(color:string){
        this.setColor(color);
    }

    private setColor(color:string){
        this.color = color;
    }

    public static of(color:string){
        return new LevelColor(color);
    }
}