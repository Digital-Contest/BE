

export class Satisfaction{
    private target:string;
    private introduceTextCategory:string;
    private introduceTextCategoryCount:number;


    public static of( target:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        return new Satisfaction( target, introduceTextCategory, introduceTextCategoryCount);
    }


    constructor(target:string, introduceTextCategory:string, introduceTextCategoryCount:number){
        this.setTarget(target);
        this.setIntroduceTextCategory(introduceTextCategory);
        this.setIntroduceTextCategoryCount(introduceTextCategoryCount);
    }


    private setTarget(target:string){
        this.target= target;
    }


    private setIntroduceTextCategory(introduceTextCategory:string){
        this.introduceTextCategory=introduceTextCategory;
    }


    private setIntroduceTextCategoryCount(introduceTextCategoryCount:number){
        this.introduceTextCategoryCount=introduceTextCategoryCount;
    }

    public getTarget(){
        return this.target;
    } 

    public getIntroduceTextCategory(){
        return this.introduceTextCategory;
    }


    public getIntroduceTextCategoryCount(){
        return this.introduceTextCategoryCount;
    }
}