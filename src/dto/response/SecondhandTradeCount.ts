import path from 'path';
import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const __filename = fileURLToPath(__filename);
// const __dirname = path.dirname(__filename);

export class SecondhandTradeCount{

    private count:number;

    constructor(count:number){
        this.setCount(count);
    }

    private setCount(count:number){
        if(count === null) throw new Error (`${__dirname} : count 값이 존재하지 않습니다.`);
        this.count=count;
    }

    public static of (count:number){
        return new SecondhandTradeCount(count);
    }
}