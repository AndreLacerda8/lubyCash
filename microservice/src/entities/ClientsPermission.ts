import {Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { Client } from "./Client";
import { Permission } from "./Permission";

@Entity('users_permissions')
export class ClientPermission {
    @PrimaryColumn()
    @Generated('increment')
    readonly id: number

    @Column()
    client_id: string

    @Column()
    permission_id: number

    @JoinColumn({name: 'client_id'})
    @ManyToOne(() => Client)
    clientId: Client

    @JoinColumn({name: 'permission_id'})
    @ManyToOne(() => Permission)
    permissionId: Permission

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date
}
