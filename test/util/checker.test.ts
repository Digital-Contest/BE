import {checkData} from '../../src/util/checker'

describe('checker 테스트', ()=>{
    it('checkData data undefined', ()=>{
        const data:any = undefined;
        const checkResult = false;
        const result = checkData(data);
        expect(result).toEqual(checkResult);
    });

    it('checkData data 존재', ()=>{
        const data:any = 'data';
        const checkResult = true;
        const result = checkData(data);
        expect(result).toEqual(checkResult);
    });
});