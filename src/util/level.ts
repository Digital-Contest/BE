export enum LevelExperience {
    LEVEL_0 = 0,
    LEVEL_1 = 30,
    LEVEL_2 = 100,
    LEVEL_3 = 300,
    LEVEL_4 = 600,
    LEVEL_5 = 1000
}

const LevelColor: { [key: string]: string } = {
    30: "pink",
    100: "brown",
    300: "blue",
    600: "purple",
    1000: "yellow"

};


export function getLevelColor(level: LevelExperience): string {
    return LevelColor[level] || "알 수 없는 오류가 발생하였습니다.";
}

export const getLevelExperience = (level:number) => {
    return LevelExperience[`LEVEL_${level}` as keyof typeof LevelExperience] - LevelExperience[`LEVEL_${level-1}` as keyof typeof LevelExperience];
}

export const getMyLevelExperience = (level:number, score:number) => {
    return score - LevelExperience[`LEVEL_${level-1}` as keyof typeof LevelExperience];
}


export const  getLevelByScore = (score: number): number => {
    switch (true) {
        case (score >= 0 && score <= 29):
            return 1;
        case (score >= 30 && score <= 99):
            return 2;
        case (score >= 100 && score <= 299):
            return 3;
        case (score >= 300 && score <= 599):
            return 4;
        case (score >= 600 && score <= 999):
            return 5;
        default:
            return -1; 
    }
}



