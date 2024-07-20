

export class PlatformSatisfaction{
    private company:string;
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;


    public static of(company:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        return new PlatformSatisfaction(company, introduceTextCategory, introduceTextCategoryCount);
    }


    constructor(company:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setCompany(company);
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }


    private setCompany(company:string){
        this.company=company;
    }


    private setIntroduceTextCategory(introduceTextCategory:string){
        this.introduceTextCategory=introduceTextCategory;
    }


    private setIntroduceTextCategoryCount(introduceTextCategoryCount:number){
        this.introduceTextCategoryCount=introduceTextCategoryCount;
    }

    public getCompany(){
        return this.company;
    } 

    public getIntroduceTextCategory(){
        return this.introduceTextCategory;
    }


    public getIntroduceTextCategoryCount(){
        return this.introduceTextCategoryCount;
    }
}