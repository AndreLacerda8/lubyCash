import {CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import { Client } from "./Client";
import { Permission } from "./Permission";

@Entity('users_permissions')
export class ClientPermission {
    @PrimaryColumn()
    readonly id: string

    @JoinColumn()
    @ManyToOne(() => Client)
    client_id: string

    @JoinColumn()
    @ManyToOne(() => Permission)
    permission_id: number

    @CreateDateColumn()
    created_at: Date
    
    @UpdateDateColumn()
    updated_at: Date
}
