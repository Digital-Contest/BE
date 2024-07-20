



export class CategorySatisfaction{

    private category:string;
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;

    public static of(category:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        return new CategorySatisfaction(category, introduceTextCategory, introduceTextCategoryCount);
    }


    constructor(category:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setCompany(category);
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }


    private setCompany(category:string){
        this.category=category;
    }


    private setIntroduceTextCategory(introduceTextCategory:string){
        this.introduceTextCategory=introduceTextCategory;
    }


    private setIntroduceTextCategoryCount(introduceTextCategoryCount:number){
        this.introduceTextCategoryCount=introduceTextCategoryCount;
    }

    public getCategory(){
        return this.category;
    } 

    public getIntroduceTextCategory(){
        return this.introduceTextCategory;
    }


    public getIntroduceTextCategoryCount(){
        return this.introduceTextCategoryCount;
    }

}