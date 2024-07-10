import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export class LevelInformation{

    private levelExperience: number;

    private myLevelExperience: number;

    private myLevel:number;

    constructor(levelExperience: number, myLevelExperience: number, myLevel:number){
        this.setLevelExperience(levelExperience),
        this.setMyLevelExperience(myLevelExperience),
        this.setMyLevel(myLevel)
    }


    private setLevelExperience(levelExperience:number){
        if(levelExperience === null) throw new Error (`${__dirname} : levelExperience 값이 존재하지 않습니다.`);
        this.levelExperience=levelExperience;
    }

    private setMyLevelExperience(myLevelExperience: number){
        if(myLevelExperience === null) throw new Error (`${__dirname} : myLevelExperience 값이 존재하지 않습니다.`);
        this.myLevelExperience=myLevelExperience;
    }


    private setMyLevel(myLevel:number){
        if(myLevel === null) throw new Error (`${__dirname} : myLevel 값이 존재하지 않습니다.`);
        this.myLevel=myLevel;
    }

    public static of(levelExperience: number, myLevelExperience: number, myLevel:number){
        return new LevelInformation(levelExperience, myLevelExperience, myLevel);
    }
}