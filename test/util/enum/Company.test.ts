
import {getAllCompany,  getCompanyByCondition, Company} from '../../../src/util/enum/Company';




describe('Company enum 테스트', () => {

  describe('getAllCompany 함수 테스트', () => {
    it('getAllCompany 정상처리', async () => {
        const expectedKeys = ['당근', '번개장터', '중고나라', '장마당'];
        const result = getAllCompany();
        expect(result).toEqual(expectedKeys);
    });
  });

  describe('getCompanyByCondition 함수 테스트', () => {
    it('getCompanyByCondition 정상처리', async () => {
        const testCases = [
            { key: '당근', expectedValue: Company.당근 },
            { key: '번개장터', expectedValue: Company.번개장터 },
            { key: '중고나라', expectedValue: Company.중고나라 },
            { key: '장마당', expectedValue: Company.장마당 },
          ];
          testCases.forEach(({ key, expectedValue }) => {
            const result = getCompanyByCondition(key);
            expect(result).toBe(expectedValue);
          });
    });

    it('getCompanyByCondition 빈 값처리', async () => {
        const result = getCompanyByCondition('key' as any);
        expect(result).toBeUndefined();
    });
  });
});