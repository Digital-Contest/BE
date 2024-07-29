

/**
* 
* @param data 
* @returns  데이터가 없을 경우 false 반환, 있을 경우 true 반환
*/
const checkData = (data: any): boolean => {
    let result = true
    if (data === undefined || data === null) {   // 데이터가 없을 경우
        return result = false;
    }
    return result;
}





export {
    checkData
}