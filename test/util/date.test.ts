import {formatDate} from '../../src/util/date';




describe('date 테스트', ()=>{

    describe('formatDate 함수', ()=>{
        it('formatDate 정상 응답', async()=>{
            const date = '2024-11-24' as unknown as Date;
            const formatDateResponse = '2024년11월24일';
            const result = formatDate(date);
            expect(result).toEqual(formatDateResponse);
        });
    });
});