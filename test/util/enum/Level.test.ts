
import {LevelExperience, getLevelColor, getLevelExperience, getMyLevelExperience, getLevelByScore } from '../../../src/util/enum/Level';

const levelExperienceTestCases = [
    { key: 'LEVEL_0', expectedValue: LevelExperience.LEVEL_0 },
    { key: 'LEVEL_1', expectedValue: LevelExperience.LEVEL_1 },
    { key: 'LEVEL_2', expectedValue: LevelExperience.LEVEL_2 },
    { key: 'LEVEL_3', expectedValue: LevelExperience.LEVEL_3 },
    { key: 'LEVEL_4', expectedValue: LevelExperience.LEVEL_4 },
    { key: 'LEVEL_5', expectedValue: LevelExperience.LEVEL_5 },
  ];

const levelColorTestCases = [
    { key: LevelExperience.LEVEL_0, expectedValue: "pink" },
    { key: LevelExperience.LEVEL_1, expectedValue: "pink" },
    { key: LevelExperience.LEVEL_2, expectedValue: "brown" },
    { key: LevelExperience.LEVEL_3, expectedValue: "blue" },
    { key: LevelExperience.LEVEL_4, expectedValue: "purple" },
    { key: LevelExperience.LEVEL_5, expectedValue: "yellow"}
];

describe('LevelExperience enum 테스트', () => {

  describe('getLevelColor 함수 테스트', () => {
    const levelColorTestCases = [
        { level: LevelExperience.LEVEL_1, expectedColor: "pink" },
        { level: LevelExperience.LEVEL_2, expectedColor: "brown" },
        { level: LevelExperience.LEVEL_3, expectedColor: "blue" },
        { level: LevelExperience.LEVEL_4, expectedColor: "purple" },
        { level: LevelExperience.LEVEL_5, expectedColor: "yellow" }
      ];

    it('getLevelColor 정상처리', async () => {
        levelColorTestCases.forEach(({ level, expectedColor }) => {
            const result = getLevelColor(level);
            expect(result).toBe(expectedColor);
          });
    });

    it('getLevelColor 예외 처리', () => {
        const result = getLevelColor(9999 as LevelExperience); 
        expect(result).toBe("알 수 없는 오류가 발생하였습니다.");
      });
  });

  describe('getLevelExperience 함수 테스트', () => {
    it('getLevelExperience 정상처리', async () => {
        const testCases = [
            { level: 1, expectedExperience: LevelExperience.LEVEL_1 - LevelExperience.LEVEL_0 },
            { level: 2, expectedExperience: LevelExperience.LEVEL_2 - LevelExperience.LEVEL_1 },
            { level: 3, expectedExperience: LevelExperience.LEVEL_3 - LevelExperience.LEVEL_2 },
            { level: 4, expectedExperience: LevelExperience.LEVEL_4 - LevelExperience.LEVEL_3 },
            { level: 5, expectedExperience: LevelExperience.LEVEL_5 - LevelExperience.LEVEL_4 }
          ];
          testCases.forEach(({level,  expectedExperience})=>{
            const result = getLevelExperience(level);
            expect(result).toEqual(expectedExperience);
          });
    });
  });

  describe('getMyLevelExperience 함수 테스트', () => {
    it('getMyLevelExperience 정상처리', async () => {
       const testCases = [
        { level: 1, score: 0, expectedExperience: 0 },
        { level: 2, score: 60, expectedExperience: 30 },
        { level: 3, score: 160, expectedExperience: 30 },
        { level: 4, score: 460, expectedExperience: 30 },
        { level: 5, score: 1060, expectedExperience: 30 }
      ];
        testCases.forEach(({level, score, expectedExperience})=>{
        const result = getMyLevelExperience(level, score);
        expect(result).toEqual(expectedExperience);
        });
    });
  });

  describe('getLevelByScore 함수 테스트', () => {
    it('getLevelByScore 정상처리', async () => {
        const testCases = [
            { score: 0, expectedLevel: 1 },
            { score: 29, expectedLevel: 1 },
            { score: 30, expectedLevel: 2 },
            { score: 129, expectedLevel: 2 },
            { score: 130, expectedLevel: 3 },
            { score: 429, expectedLevel: 3 },
            { score: 430, expectedLevel: 4 },
            { score: 1029, expectedLevel: 4 },
            { score: 1030, expectedLevel: 5 },
            { score: 2029, expectedLevel: 5 },
            { score: 2030, expectedLevel: 5 } // Edge case
          ];
        testCases.forEach(({score, expectedLevel})=>{
        const result = getLevelByScore(score);
        expect(result).toEqual(expectedLevel);
        });
    });
  });
});