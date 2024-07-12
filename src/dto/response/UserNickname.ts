


export class UserNickname{
    private nickname:string;

    constructor(nickname:string){
        this.setNickname(nickname);
    }

    public static of(nickname:string){
        return new UserNickname(nickname);
    }


    private setNickname(nickname:string){
        this.nickname=nickname;
    }
}