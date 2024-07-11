export enum LevelExperience {
    LEVEL_0 = 0,
    LEVEL_1 = 30,
    LEVEL_2 = 130,
    LEVEL_3 = 430,
    LEVEL_4 = 1030,
    LEVEL_5 = 2030
}

const LevelColor: { [key: string]: string } = {
    30: "pink",
    130: "brown",
    430: "blue",
    1030: "purple",
    2030: "yellow"

};


export function getLevelColor(level: LevelExperience): string {
    return LevelColor[level] || "알 수 없는 오류가 발생하였습니다.";
}

export const getLevelExperience = (level:number) => {
    return LevelExperience[`LEVEL_${level}` as keyof typeof LevelExperience] 
    - LevelExperience[`LEVEL_${level-1}` as keyof typeof LevelExperience];
}

export const getMyLevelExperience = (level:number, score:number) => {
    return score - LevelExperience[`LEVEL_${level-1}` as keyof typeof LevelExperience];
}


export const  getLevelByScore = (score: number): number => {
    switch (true) {
        case (score >= 0 && score <= 29):
            return 1;
        case (score >= 30 && score <= 129):
            return 2;
        case (score >= 130 && score <= 429):
            return 3;
        case (score >= 430 && score <= 1029):
            return 4;
        case (score >= 1030 && score <= 2029):
            return 5;
        default:
            return 5; 
    }
}



