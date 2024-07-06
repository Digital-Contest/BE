

export enum ErrorCode  {
    
    ERROR = 501,
    NO_VALUE=502,
    LOGIN_AGAIN=403,
    NOT_EXPIRED=404,
    NOT_FOUND_CATEGORY=405
    
}

// 각 에러 코드에 대한 메시지 정의
const ErrorMessages: { [key: number]: string } = {
    501: "강제 에러 발생",
    502: "해당 값이 존재하지 않습니다.",
    403: "재로그인 하세요",
    404: "토큰이 만료되지 않았습니다.",
    405: "카테고리 데이터가 존재하지 않습니다."

};

export function errorMessage(code: ErrorCode): string {
    return ErrorMessages[code] || "알 수 없는 오류가 발생하였습니다.";
}