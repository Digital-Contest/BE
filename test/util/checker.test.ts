import {checkData} from '../../src/util/checker'

describe('checker 테스트', ()=>{


    it('checkData 함수 테스트', ()=>{
        const data:any = undefined;
        const checkResult = true;
        const result = checkData(data);

        expect(result).not.toEqual(checkResult);
    });
});