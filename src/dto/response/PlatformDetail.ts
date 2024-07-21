

export class PlatformDetail{

    private company:string;
    private data:PlatformDetailData[];


    constructor(company:string, data:PlatformDetailData[]){
        this.setCompany(company);
        this.setData(data)
    }


    public static of(company:string, data:PlatformDetailData[]){
        return new PlatformDetail(company, data);
    }


    private setCompany(company:string){
        this.company=company;
    }

    private setData(data:PlatformDetailData[]){
        this.data=data;
    }
}



export class PlatformDetailData{
 
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;

    constructor(introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }

    public static of(introduceTextCategory:string, introduceTextCategoryCount:number){
        return new PlatformDetailData(introduceTextCategory, introduceTextCategoryCount);
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
        return this.getIntroduceTextCategoryCount;
    }



}