

export class SatisfactionDetail{

    private target:string;
    private data:SatisfactionDetailData[];


    constructor(target:string, data:SatisfactionDetailData[]){
        this.setTarget(target);
        this.setData(data)
    }


    public static of(target:string, data:SatisfactionDetailData[]){
        return new SatisfactionDetail(target, data);
    }


    private setTarget(target:string){
        this.target=target;
    }

    private setData(data:SatisfactionDetailData[]){
        this.data=data;
    }
}



export class SatisfactionDetailData{
 
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;

    constructor(introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }

    public static of(introduceTextCategory:string, introduceTextCategoryCount:number){
        return new SatisfactionDetailData(introduceTextCategory, introduceTextCategoryCount);
    }

 
    private setIntroduceTextCategory(introduceTextCategory:string){
        this.introduceTextCategory=introduceTextCategory
    }

    public setIntroduceTextCategoryCount(introduceTextCategoryCount:number){
        this.introduceTextCategoryCount=introduceTextCategoryCount;
    }

    public getIntroduceTextCategory(){
        return this.introduceTextCategory;
    }

    public getIntroduceTextCategoryCount(){
        return this.introduceTextCategoryCount;
    }



}