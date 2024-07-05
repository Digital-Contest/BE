import { BaseEntity } from "./BaseEntity.js"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm"
import { InternalServerError } from "routing-controllers";
import { Relation } from "typeorm";



@Entity("User")
export class User extends BaseEntity{
  
    constructor(numbers:string, email:string, role:string){
        super();
        this.setNumber(numbers)
        this.setEmail(email),
        this.setRole(role)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    numbers:string;

    @Column()
    email: string;

    @Column()
    role: string;
   
    public static createUser(numbers:string, email:string, role:string){
        return new User(numbers, email, role)
    }

    private setNumber(numbers:string): void{
        if(numbers === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.numbers=numbers
    }
    // 유효성 검증

    private setEmail(email:string): void{
        if(email=== null) throw new InternalServerError(`${__dirname} : email 값이 존재하지 않습니다.`);
        this.email=email
    }
        // 유효성 검증
    private setRole(role:string): void{
        if(role=== null) throw new InternalServerError(`${__dirname} :role 값이 존재하지 않습니다.`);
        this.role=role
    }

    public getNumber() {
        return this.numbers;
    }
    
    public getEmail() {
        return this.email;
    }

    public getId() {
        return this.id;
    }

    public getRole() {
        return this.role;
    }

    

}