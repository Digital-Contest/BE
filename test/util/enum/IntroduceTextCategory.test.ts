
import {getAllIntroduceTextCategory, getIntroduceTextCategoryByCondition, IntroduceTextCategory} from '../../../src/util/enum/IntroduceTextCategory';




describe('IntroduceTextCategory enum 테스트', () => {

  describe('getAllIntroduceTextCategoryy 함수 테스트', () => {
    it('getAllIntroduceTextCategory 정상처리', async () => {
        const expectedKeys = ["궁서체", "둥글둥글체", "단호박체", "성냥팔이체", 
            "귀욤체", "요점만체"];
        const result =  getAllIntroduceTextCategory();
        expect(result).toEqual(expectedKeys);
    });
  });

  describe('getIntroduceTextCategoryByCondition 함수 테스트', () => {
    it('getIntroduceTextCategoryByCondition 정상처리', async () => {
        const testCases = [
            { key: "궁서체", expectedValue: IntroduceTextCategory["궁서체"] },
            { key: "둥글둥글체", expectedValue: IntroduceTextCategory["둥글둥글체"] },
            { key: "단호박체", expectedValue: IntroduceTextCategory["단호박체"] },
            { key: "성냥팔이체", expectedValue: IntroduceTextCategory["성냥팔이체"] },
            { key: "귀욤체", expectedValue: IntroduceTextCategory["귀욤체"] },
            { key: "요점만체", expectedValue: IntroduceTextCategory["요점만체"] },
          ];
          testCases.forEach(({ key, expectedValue }) => {
            const result = getIntroduceTextCategoryByCondition(key);
            expect(result).toBe(expectedValue);
          });
    });

    it('getIntroduceTextCategoryByCondition 빈 값처리', async () => {
        const result = getIntroduceTextCategoryByCondition('key' as any);
        expect(result).toBeUndefined();
    });
  });
});