import {Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { v4 as uuid } from 'uuid'

@Entity('clients')
export class Client {
    @PrimaryColumn()
    readonly id: string

    @Column()
    full_name: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    phone: string

    @Column()
    cpf_number: string

    @Column()
    address: string

    @Column()
    city: string

    @Column()
    state: string

    @Column()
    zipcode: string

    @Column()
    current_balance: string

    @Column()
    average_salary: string

    @Column()
    status: string

    @Column()
    status_date: Date

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date

    constructor(){
        if(!this.id)
            this.id = uuid()
    }
}
