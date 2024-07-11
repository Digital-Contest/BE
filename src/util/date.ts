

/**
 * 2024-07-11T08:00:45.417Z -> 2024-7/11 변환 함수
 * @param date 날짜
 * @returns 포맷된 날짜
 */
export const formatDate = (date:Date) =>{
    const settingDate = new Date(date);
    const formattedDate = `${settingDate.getFullYear()}-${ settingDate.getMonth() + 1}/${settingDate.getDate()}`;
    return formattedDate;
}