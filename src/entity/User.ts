import { BaseEntity } from "./base/BaseEntity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from "typeorm"
import { InternalServerError } from "routing-controllers";
import { Relation } from "typeorm";
import { Product } from "./Product";



@Entity("user")
export class User extends BaseEntity{
  
    constructor(numbers:string, email:string, role:string, nickname:string){
        super();
        this.setNumber(numbers)
        this.setEmail(email),
        this.setRole(role),
        this.setNickname(nickname)
    }

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', name: 'numbers', nullable: false })
    numbers:string;

    @Column({ type: 'varchar', name: 'nickname', nullable: false })
    nickname: string;

    @Column({ type: 'varchar', name: 'email', nullable: false })
    email: string;

    @Column({ type: 'varchar', name: 'role', nullable: false })
    role: string;

    @Column({ type: 'int', name: 'score', nullable: false, default : 0})
    score: number;

    @OneToMany(() => Product , products => products.user)
    products: Relation<Product>[];
   
    public static createUser(numbers:string, email:string, role:string, nickname:string){
        return new User(numbers, email, role, nickname);
    }

    private setNumber(numbers:string): void{
        if(numbers === null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.numbers=numbers
    }


    private setEmail(email:string): void{
        if(email=== null) throw new InternalServerError(`${__dirname} : email 값이 존재하지 않습니다.`);
        this.email=email
    }

    
    private setNickname(nickname:string): void{
        if(nickname=== null) throw new InternalServerError(`${__dirname} : nickname 값이 존재하지 않습니다.`);
        this.nickname=nickname
    }
   
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

    public getScore(){
        return this.score;
    }

    public getNickname(){
        return this.nickname;
    }

    

}