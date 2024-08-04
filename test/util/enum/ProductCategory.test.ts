
import {getProductCategoryByCondition, getAllProductCategory, ProductCategory} from '../../../src/util/enum/ProductCategory';




describe('ProductCategory enum 테스트', () => {

  describe('getAllProductCategory 함수 테스트', () => {
    it('getAllProductCategory 정상처리', async () => {
        const expectedKeys = ["기타중고", "도서", "식물", "티켓/교환권", 
            "뷰티/미용",  "여성패션/잡화", "남성패션/잡화", "취미/게임/음반", 
            "반려동물용품", "가공식품", "생활주방", "스포츠/레저", "생활가전", 
            "디지털기기", "건강기능식품"];
        const result = getAllProductCategory();
        expect(result).toEqual(expectedKeys);
    });
  });

  describe('getProductCategoryByCondition 함수 테스트', () => {
    it('getProductCategoryByCondition 정상처리', async () => {
        const testCases = [
            { key: "기타중고", expectedValue: ProductCategory["기타중고"] },
            { key: "도서", expectedValue: ProductCategory["도서"] },
            { key: "식물", expectedValue: ProductCategory["식물"] },
            { key: "티켓/교환권", expectedValue: ProductCategory["티켓/교환권"] },
            { key: "뷰티/미용", expectedValue: ProductCategory["뷰티/미용"] },
            { key: "여성패션/잡화", expectedValue: ProductCategory["여성패션/잡화"] },
            { key: "남성패션/잡화", expectedValue: ProductCategory["남성패션/잡화"] },
            { key: "취미/게임/음반", expectedValue: ProductCategory["취미/게임/음반"] },
            { key: "반려동물용품", expectedValue: ProductCategory["반려동물용품"] },
            { key: "가공식품", expectedValue: ProductCategory["가공식품"] },
            { key: "생활주방", expectedValue: ProductCategory["생활주방"] },
            { key: "스포츠/레저", expectedValue: ProductCategory["스포츠/레저"] },
            { key: "생활가전", expectedValue: ProductCategory["생활가전"] },
            { key: "디지털기기", expectedValue: ProductCategory["디지털기기"] },
            { key: "건강기능식품", expectedValue: ProductCategory["건강기능식품"] }
          ];
          testCases.forEach(({ key, expectedValue }) => {
            const result = getProductCategoryByCondition(key);
            expect(result).toBe(expectedValue);
          });
    });

    it('getProductCategoryByCondition 빈 값처리', async () => {
        const result = getProductCategoryByCondition('key' as any);
        expect(result).toBeUndefined();
    });
  });
});