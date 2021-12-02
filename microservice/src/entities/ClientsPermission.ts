import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { Client } from "./Client";
import { Permission } from "./Permission";

@Entity('users_permissions')
export class ClientPermission {
    @PrimaryColumn()
    readonly id: string

    @JoinColumn({name: 'client_id'})
    @ManyToOne(() => Client)
    clientId: Client | string

    @JoinColumn({name: 'permission_id'})
    @ManyToOne(() => Permission)
    permissionId: Permission | number

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date
}
