export class CategoryDetail{


    private category:string;
    private data:CategoryDetailData[];


    constructor(category:string, data:CategoryDetailData[]){
        this.setCategory(category);
        this.setData(data)
    }


    public static of(category:string, data:CategoryDetailData[]){
        return new CategoryDetail(category, data);
    }


    private setCategory(category:string){
        this.category=category;
    }

    private setData(data:CategoryDetailData[]){
        this.data=data;
    }
}



export class CategoryDetailData{
 
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;

    constructor(introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }

    public static of(introduceTextCategory:string, introduceTextCategoryCount:number){
        return new CategoryDetailData(introduceTextCategory, introduceTextCategoryCount);
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