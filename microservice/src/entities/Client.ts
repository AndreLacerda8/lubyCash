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

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date

    constructor(){
        if(!this.id)
            this.id = uuid()
    }
}
